/**
 * Which OS and CPU the visitor is on, and a human label for it.
 *
 * Split out of `useDownload` because the two variants of this site need very
 * different amounts of work for the same answer. Resolving a *download* means
 * asking GitHub which assets exist; resolving a *label* — "macOS (Apple
 * Silicon)" next to an email field — needs nothing but the user agent.
 * Sharing one composable meant the early-access page fetched every release on
 * every load: 25 KB of third-party JSON, a DNS lookup and a TLS handshake, to
 * render a string that was already known locally.
 */
export type Platform = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown'
export type Arch = 'x64' | 'arm64' | 'unknown'

export function platformLabel(platform: Platform, arch: Arch): string {
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

export async function detectPlatform(): Promise<{ platform: Platform, arch: Arch }> {
  if (import.meta.server) return { platform: 'unknown', arch: 'unknown' }

  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator as { userAgentData?: { platform?: string } } & Navigator)
    .userAgentData?.platform?.toLowerCase() ?? navigator.platform?.toLowerCase() ?? ''

  // Mobile first, or they fall through to desktop: an iOS UA contains
  // "Mac OS" and an Android UA contains "Linux".
  let os: Platform = 'unknown'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'ios'
  }
  else if (ua.includes('android')) {
    os = 'android'
  }
  else if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) {
    os = 'macos'
  }
  else if (platform.includes('win') || ua.includes('windows')) {
    os = 'windows'
  }
  else if (platform.includes('linux') || ua.includes('linux')) {
    os = 'linux'
  }

  let arch: Arch = 'x64'
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
    }
    catch {
      // Hints unavailable — fall through.
    }

    // 2. The GPU string names the chip on Apple Silicon. Prefer the plain
    //    RENDERER parameter: WEBGL_debug_renderer_info is deprecated and warns
    //    on every call in Firefox, which is noisy for a detail this minor.
    if (!decided) {
      try {
        const gl = document.createElement('canvas').getContext('webgl')
        if (gl) {
          let renderer = String(gl.getParameter(gl.RENDERER) ?? '')
          if (!/apple/i.test(renderer)) {
            const dbg = gl.getExtension('WEBGL_debug_renderer_info')
            if (dbg) renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '')
          }
          if (renderer.includes('Apple M') || renderer.includes('Apple GPU')) { arch = 'arm64'; decided = true }
        }
      }
      catch {
        // Ignore — WebGL may be blocked.
      }
    }

    // 3. Still unknown (Safari exposes neither). Assume Apple Silicon: every
    //    Mac sold since 2020 is one.
    if (!decided) arch = 'arm64'
  }

  return { platform: os, arch }
}

/**
 * Platform label only, with no network access at all. Server-renders as "your
 * platform" and sharpens once mounted, which is why the copy around it has to
 * read correctly either way.
 */
export function usePlatform() {
  const platform = ref<Platform>('unknown')
  const arch = ref<Arch>('unknown')
  const label = ref('your platform')

  onMounted(async () => {
    const detected = await detectPlatform()
    platform.value = detected.platform
    arch.value = detected.arch
    label.value = platformLabel(detected.platform, detected.arch)
  })

  return { platform, arch, label }
}
