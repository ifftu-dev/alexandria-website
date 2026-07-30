import { detectPlatform, platformLabel as sharedPlatformLabel } from './usePlatform'

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
  /** Set when the build on offer is older than the newest release. */
  fromOlderRelease: string | null
  ctaLabel: string
}

interface GitHubAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  html_url: string
  draft?: boolean
  prerelease?: boolean
  assets: GitHubAsset[]
}

const GITHUB_REPO_URL = 'https://github.com/ifftu-dev/alexandria'
const RELEASES_URL = `${GITHUB_REPO_URL}/releases`

/**
 * Never hand any of these to someone clicking Download: `.aab` is a Play Store
 * bundle, `.ipa` needs TestFlight or a signing profile, and the tarball, its
 * signature and `latest.json` belong to the auto-updater.
 */
const NEVER_OFFER = /(\.aab|\.sig|\.ipa|latest\.json|\.app\.tar\.gz)$/i

/**
 * Candidate patterns per platform+arch, most specific first, matched against
 * asset names like `Alexandria-0.4.5-alpha-macOS-Apple-Silicon.dmg`.
 *
 * These are deliberately loose on naming and strict on file type, so a build
 * is picked up the day CI starts publishing it without this file changing.
 * The one place looseness is unsafe is Intel macOS: it must never fall back to
 * an unqualified `.dmg`, because the only one published is Apple Silicon and
 * it will not run.
 */
const ASSET_MATCHERS: Record<string, RegExp[]> = {
  'macos-arm64': [/(apple[-_ ]?silicon|aarch64|arm64)[^/]*\.dmg$/i, /\.dmg$/i],
  'macos-x64': [/(intel|x64|x86[-_]?64)[^/]*\.dmg$/i],
  'windows-x64': [/(x64|amd64)[^/]*\.(exe|msi)$/i, /\.(exe|msi)$/i],
  'windows-arm64': [/(arm64|aarch64)[^/]*\.(exe|msi)$/i, /\.(exe|msi)$/i],
  'linux-x64': [/(amd64|x86[-_]?64|x64)[^/]*\.appimage$/i, /\.appimage$/i, /(amd64|x86[-_]?64)[^/]*\.deb$/i, /\.deb$/i],
  'linux-arm64': [/(aarch64|arm64)[^/]*\.appimage$/i, /(aarch64|arm64)[^/]*\.deb$/i],
  'android-arm64': [/\.apk$/i],
  'android-x64': [/\.apk$/i],
}

interface AssetMatch {
  url: string
  release: GitHubRelease
}

/** First matching asset in one release, honouring matcher priority. */
function matchAsset(assets: GitHubAsset[], platform: DownloadInfo['platform'], arch: DownloadInfo['arch']): GitHubAsset | null {
  const patterns = ASSET_MATCHERS[`${platform}-${arch}`]
  if (!patterns) return null
  const usable = assets.filter(a => !NEVER_OFFER.test(a.name))
  for (const pattern of patterns) {
    const hit = usable.find(a => pattern.test(a.name))
    if (hit) return hit
  }
  return null
}

/**
 * Walk releases newest-first for a build this visitor can install. The latest
 * release does not always carry every platform — when it doesn't, an older
 * build of the right kind beats sending someone to a release page to hunt.
 */
function findAsset(releases: GitHubRelease[], platform: DownloadInfo['platform'], arch: DownloadInfo['arch']): AssetMatch | null {
  for (const release of releases) {
    const asset = matchAsset(release.assets, platform, arch)
    if (asset) return { url: asset.browser_download_url, release }
  }
  return null
}

async function fetchReleases(): Promise<GitHubRelease[]> {
  const res = await fetch('https://api.github.com/repos/ifftu-dev/alexandria/releases')
  if (!res.ok) return []
  const releases: GitHubRelease[] = await res.json()
  return Array.isArray(releases) ? releases.filter(r => !r.draft) : []
}

/** Label once we know whether a file exists for this visitor. */
function labelFor(
  platform: DownloadInfo['platform'],
  platformLabel: string,
  action: DownloadInfo['action'],
  fromOlderRelease: string | null,
  checked: boolean,
): string {
  if (action === 'file') {
    const base = platform === 'android' ? 'Download the APK' : `Download for ${platformLabel}`
    // Say so when the newest release skipped this platform, rather than
    // quietly serving an older version.
    return fromOlderRelease ? `${base} (${fromOlderRelease})` : base
  }
  if (platform === 'ios') return 'Coming to the App Store'
  // Claims about what does or doesn't exist are only honest once the release
  // list actually came back. If the API was unreachable, say nothing.
  if (!checked) return 'Download'
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
    fromOlderRelease: null,
    ctaLabel: 'Download',
  })

  const allPlatformsUrl = ref(RELEASES_URL)
  const releaseTag = ref<string | null>(null)

  onMounted(async () => {
    const { platform, arch } = await detectPlatform()
    const platformLabel = sharedPlatformLabel(platform, arch)

    // Resolve straight away. This is the page's primary action, so it must not
    // sit on a stale destination while the request waits for idle — the
    // response is off the critical path either way.
    let action: DownloadInfo['action'] = platform === 'ios' ? 'none' : 'releases'
    let downloadUrl = RELEASES_URL
    let fromOlderRelease: string | null = null
    let checked = false

    try {
      const releases = await fetchReleases()
      checked = releases.length > 0
      const latest = releases[0]

      if (latest) {
        allPlatformsUrl.value = latest.html_url
        releaseTag.value = latest.tag_name
        downloadUrl = latest.html_url
      }

      // iOS has nothing installable in any release, so don't go looking.
      const match = platform === 'ios' ? null : findAsset(releases, platform, arch)
      if (match) {
        // browser_download_url is served with Content-Disposition: attachment,
        // so this downloads the build rather than navigating to a page.
        downloadUrl = match.url
        action = 'file'
        if (latest && match.release.tag_name !== latest.tag_name) {
          fromOlderRelease = match.release.tag_name
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
      fromOlderRelease,
      ctaLabel: labelFor(platform, platformLabel, action, fromOlderRelease, checked),
    }
  })

  return {
    download: readonly(info),
    allPlatformsUrl: readonly(allPlatformsUrl),
    releaseTag: readonly(releaseTag),
  }
}
