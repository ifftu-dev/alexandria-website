interface DownloadInfo {
  platform: 'macos' | 'windows' | 'linux' | 'unknown'
  arch: 'x64' | 'arm64' | 'unknown'
  platformLabel: string
  downloadUrl: string
  platformIcon: string
}

const GITHUB_REPO_URL = 'https://github.com/ifftu-dev/alexandria'
const RELEASES_URL = `${GITHUB_REPO_URL}/releases`

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

function buildDownloadUrl(platform: DownloadInfo['platform'], arch: DownloadInfo['arch']): string {
  // Construct direct download URL based on Tauri naming conventions
  // These will need to be updated when actual releases are published
  switch (platform) {
    case 'macos':
      return arch === 'arm64'
        ? `${RELEASES_URL}/latest/download/Alexandria_aarch64.dmg`
        : `${RELEASES_URL}/latest/download/Alexandria_x64.dmg`
    case 'windows':
      return `${RELEASES_URL}/latest/download/Alexandria_x64-setup.exe`
    case 'linux':
      return `${RELEASES_URL}/latest/download/Alexandria_amd64.AppImage`
    default:
      return `${RELEASES_URL}/latest`
  }
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
    downloadUrl: `${RELEASES_URL}/latest`,
    platformIcon: 'download',
  })

  onMounted(() => {
    const { platform, arch } = detectPlatform()
    info.value = {
      platform,
      arch,
      platformLabel: getPlatformLabel(platform, arch),
      downloadUrl: buildDownloadUrl(platform, arch),
      platformIcon: getPlatformIcon(platform),
    }
  })

  const allPlatformsUrl = `${RELEASES_URL}/latest`

  return {
    download: readonly(info),
    allPlatformsUrl,
  }
}
