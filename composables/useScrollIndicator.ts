export function useScrollIndicator(heroRef: Ref<HTMLElement | null>) {
  const showIndicator = ref(false)

  onMounted(() => {
    const hero = heroRef.value
    if (!hero) return

    // Find the next sibling section after the hero
    const nextSection = hero.nextElementSibling as HTMLElement | null
    if (!nextSection) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        // Show indicator when the next section is NOT visible
        showIndicator.value = !entry.isIntersecting
      },
      { threshold: 0 },
    )

    observer.observe(nextSection)

    onUnmounted(() => observer.disconnect())
  })

  return { showIndicator }
}
