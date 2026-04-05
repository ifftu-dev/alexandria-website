interface DownloadInfo {
  platform: 'macos' | 'windows' | 'linux' | 'unknown'
  arch: 'x64' | 'arm64' | 'unknown'
  platformLabel: string
  downloadUrl: string
  platformIcon: string
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

const ASSET_PATTERNS: Record<string, RegExp> = {
  'macos-arm64': /aarch64\.dmg$/,
  'macos-x64': /aarch64\.dmg$/, // no Intel build — use ARM (runs via Rosetta)
  'windows-x64': /x64-setup\.exe$/,
  'windows-arm64': /x64-setup\.exe$/, // no ARM Windows build
  'linux-x64': /amd64\.AppImage$/,
  'linux-arm64': /aarch64\.AppImage$/,
}

function detectPlatform(): { platform: DownloadInfo['platform']; arch: DownloadInfo['arch'] } {
  if (import.meta.server) return { platform: 'unknown', arch: 'unknown' }

  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator as any).userAgentData?.platform?.toLowerCase() ?? navigator.platform?.toLowerCase() ?? ''

  // Detect OS
  let os: DownloadInfo['platform'] = 'unknown'
  if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) {
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
  // macOS Apple Silicon detection
  if (os === 'macos') {
    // navigator.userAgentData is the most reliable for Apple Silicon
    const uaData = (navigator as any).userAgentData
    if (uaData?.architecture === 'arm') {
      arch = 'arm64'
    }
    // Fallback: check if running through Rosetta or natively on ARM
    // WebGL renderer can sometimes hint at Apple Silicon
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          if (renderer.includes('Apple M') || renderer.includes('Apple GPU')) {
            arch = 'arm64'
          }
        }
      }
    } catch {
      // Ignore WebGL detection failure
    }
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
    default:
      return 'your platform'
  }
}

function getPlatformIcon(platform: DownloadInfo['platform']): string {
  switch (platform) {
    case 'macos': return 'apple'
    case 'windows': return 'windows'
    case 'linux': return 'linux'
    default: return 'download'
  }
}

export function useDownload() {
  const info = ref<DownloadInfo>({
    platform: 'unknown',
    arch: 'unknown',
    platformLabel: 'your platform',
    downloadUrl: GITHUB_REPO_URL,
    platformIcon: 'download',
  })

  const allPlatformsUrl = ref(RELEASES_URL)

  onMounted(async () => {
    const { platform, arch } = detectPlatform()

    info.value = {
      platform,
      arch,
      platformLabel: getPlatformLabel(platform, arch),
      downloadUrl: GITHUB_REPO_URL,
      platformIcon: getPlatformIcon(platform),
    }

    try {
      const release = await fetchLatestRelease()
      if (release) {
        allPlatformsUrl.value = release.html_url
        const assetUrl = findAssetUrl(release.assets, platform, arch)
        if (assetUrl) {
          info.value = { ...info.value, downloadUrl: assetUrl }
        } else {
          info.value = { ...info.value, downloadUrl: release.html_url }
        }
      }
    } catch {
      // API failed — keep fallback URLs
    }
  })

  return {
    download: readonly(info),
    allPlatformsUrl: readonly(allPlatformsUrl),
  }
}
