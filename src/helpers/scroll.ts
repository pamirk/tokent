export function scrollToTargetAdjusted(target: HTMLElement) {
  const scroll = () => {
    const headerOffset = 65
    window.scrollTo({
      top: target.offsetTop - headerOffset,
      behavior: "smooth",
    })
  }

  // Wait for 1sec before scrolling so the page has time to load contents and render items.
  setTimeout(() => {
    scroll()
  }, 1000)
}
