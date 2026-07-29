interface DownloadInfo {
  platform: 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown'
  arch: 'x64' | 'arm64' | 'unknown'
  platformLabel: string
  downloadUrl: string
  platformIcon: string
  /**
   * What the CTA can actually do for this visitor:
   * - `file`     a build exists — the link downloads it straight from GitHub
   * - `releases` no build for this platform yet — send them to the releases page
   * - `none`     nothing installable at all (iOS ships through the App Store)
   */
  action: 'file' | 'releases' | 'none'
  /** True only when `action === 'file'`. Kept for template convenience. */
  installable: boolean
  ctaLabel: string
}

interface GitHubAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  html_url: string
  assets: GitHubAsset[]
}

const GITHUB_REPO_URL = 'https://github.com/ifftu-dev/alexandria'
const RELEASES_URL = `${GITHUB_REPO_URL}/releases`

/**
 * Matched against real asset names on the latest release, e.g.
 * `Alexandria-0.4.5-alpha-macOS-Apple-Silicon.dmg`.
 *
 * Only what a visitor can actually install is listed here. The release also
 * carries `.aab` (a Play Store bundle, not sideloadable), `.ipa` (needs
 * TestFlight or a signing profile) and the updater's `.app.tar.gz`/`.sig`/
 * `latest.json` — none of which should ever be handed to someone clicking
 * Download. Windows, Linux and Intel macOS have no build yet.
 */
const ASSET_PATTERNS: Record<string, RegExp> = {
  'macos-arm64': /macOS-Apple-Silicon\.dmg$/,
  'android-arm64': /Android\.apk$/,
  'android-x64': /Android\.apk$/,
}

async function detectPlatform(): Promise<{ platform: DownloadInfo['platform'], arch: DownloadInfo['arch'] }> {
  if (import.meta.server) return { platform: 'unknown', arch: 'unknown' }

  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator as any).userAgentData?.platform?.toLowerCase() ?? navigator.platform?.toLowerCase() ?? ''

  // Detect OS — check mobile platforms first so they don't fall through
  // to desktop matches (iOS UA contains "Mac OS", Android UA contains "Linux")
  let os: DownloadInfo['platform'] = 'unknown'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'ios'
  } else if (ua.includes('android')) {
    os = 'android'
  } else if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) {
    os = 'macos'
  } else if (platform.includes('win') || ua.includes('windows')) {
    os = 'windows'
  } else if (platform.includes('linux') || ua.includes('linux')) {
    os = 'linux'
  }

  // Detect architecture
  let arch: DownloadInfo['arch'] = 'x64'
  if (ua.includes('arm64') || ua.includes('aarch64') || platform.includes('arm')) {
    arch = 'arm64'
  }
  // macOS never admits to being Apple Silicon in the UA string — every Mac
  // still reports "Intel Mac OS X". Three sources, most reliable first.
  if (os === 'macos') {
    let decided = false

    // 1. Client hints. `architecture` is high-entropy, so it only arrives via
    //    getHighEntropyValues() — reading the property directly is always
    //    undefined, which is how this used to fail for every Mac.
    try {
      const uaData = (navigator as unknown as {
        userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> }
      }).userAgentData
      if (uaData?.getHighEntropyValues) {
        const hints = await uaData.getHighEntropyValues(['architecture'])
        if (hints.architecture === 'arm') { arch = 'arm64'; decided = true }
        else if (hints.architecture === 'x86') { arch = 'x64'; decided = true }
      }
    } catch {
      // Hints unavailable — fall through.
    }

    // 2. The GPU string names the chip on Apple Silicon.
    if (!decided) {
      try {
        const gl = document.createElement('canvas').getContext('webgl')
        const dbg = gl?.getExtension('WEBGL_debug_renderer_info')
        if (gl && dbg) {
          const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
          if (renderer.includes('Apple M') || renderer.includes('Apple GPU')) { arch = 'arm64'; decided = true }
        }
      } catch {
        // Ignore — WebGL may be blocked.
      }
    }

    // 3. Still unknown (Safari exposes neither). Assume Apple Silicon: every
    //    Mac sold since 2020 is one, and the button says "Apple Silicon" on
    //    it, so an Intel holdout sees the requirement before clicking.
    if (!decided) arch = 'arm64'
  }

  return { platform: os, arch }
}

function findAssetUrl(assets: GitHubAsset[], platform: DownloadInfo['platform'], arch: DownloadInfo['arch']): string | null {
  const pattern = ASSET_PATTERNS[`${platform}-${arch}`]
  if (!pattern) return null
  const asset = assets.find(a => pattern.test(a.name))
  return asset?.browser_download_url ?? null
}

async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  const res = await fetch('https://api.github.com/repos/ifftu-dev/alexandria/releases')
  if (!res.ok) return null
  const releases: GitHubRelease[] = await res.json()
  return releases[0] ?? null
}

function getPlatformLabel(platform: DownloadInfo['platform'], arch: DownloadInfo['arch']): string {
  switch (platform) {
    case 'macos':
      return arch === 'arm64' ? 'macOS (Apple Silicon)' : 'macOS (Intel)'
    case 'windows':
      return 'Windows'
    case 'linux':
      return 'Linux'
    case 'ios':
      return 'iOS'
    case 'android':
      return 'Android'
    default:
      return 'your platform'
  }
}

/** Label once we know whether a file exists for this visitor. */
function labelFor(platform: DownloadInfo['platform'], platformLabel: string, action: DownloadInfo['action']): string {
  if (action === 'file') {
    return platform === 'android' ? 'Download the APK' : `Download for ${platformLabel}`
  }
  if (platform === 'ios') return 'Coming to the App Store'
  if (platform === 'macos') return 'Apple Silicon only for now'
  if (platform === 'windows' || platform === 'linux') return `No ${platformLabel} build yet`
  return 'See all downloads'
}

function getPlatformIcon(platform: DownloadInfo['platform']): string {
  switch (platform) {
    case 'macos': return 'apple'
    case 'ios': return 'download'
    case 'android': return 'download'
    case 'windows': return 'windows'
    case 'linux': return 'linux'
    default: return 'download'
  }
}

export function useDownload() {
  // Server-rendered state: the releases page is the only destination that is
  // correct for everyone, so it is what the markup ships with.
  const info = ref<DownloadInfo>({
    platform: 'unknown',
    arch: 'unknown',
    platformLabel: 'your platform',
    downloadUrl: RELEASES_URL,
    platformIcon: 'download',
    action: 'releases',
    installable: false,
    ctaLabel: 'Download',
  })

  const allPlatformsUrl = ref(RELEASES_URL)
  const releaseTag = ref<string | null>(null)

  onMounted(async () => {
    const { platform, arch } = await detectPlatform()
    const platformLabel = getPlatformLabel(platform, arch)

    // Resolve the asset straight away. This is the page's primary action, so
    // it must not sit on a stale destination while the request waits for idle
    // — the 24 KB response is off the critical path either way.
    let action: DownloadInfo['action'] = platform === 'ios' ? 'none' : 'releases'
    let downloadUrl = RELEASES_URL

    try {
      const release = await fetchLatestRelease()
      if (release) {
        allPlatformsUrl.value = release.html_url
        releaseTag.value = release.tag_name
        downloadUrl = release.html_url

        const assetUrl = findAssetUrl(release.assets, platform, arch)
        if (assetUrl) {
          // browser_download_url is served with Content-Disposition:
          // attachment, so this downloads the build rather than navigating.
          downloadUrl = assetUrl
          action = 'file'
        }
      }
    } catch {
      // API unreachable — the releases page stays as the destination.
    }

    info.value = {
      platform,
      arch,
      platformLabel,
      downloadUrl,
      platformIcon: getPlatformIcon(platform),
      action,
      installable: action === 'file',
      ctaLabel: labelFor(platform, platformLabel, action),
    }
  })

  return {
    download: readonly(info),
    allPlatformsUrl: readonly(allPlatformsUrl),
    releaseTag: readonly(releaseTag),
  }
}
