<script setup lang="ts">
/**
 * The waiting-list form, in a dialog.
 *
 * Built on the native `<dialog>` element with `showModal()`, which is what makes
 * this cheap to get right: the browser supplies the focus trap, the Escape
 * handler, inertness of the page behind it and the ::backdrop — all things a
 * hand-rolled overlay gets subtly wrong. What is left to do here is close on a
 * backdrop click, keep the `open` state in sync when the browser closes the
 * dialog itself, and restore focus to whatever opened it.
 *
 * Rendered once, from the landing layout, so every trigger on any page opens the
 * same dialog.
 */
const { isOpen, close } = useWaitlist()
const dialog = ref<HTMLDialogElement | null>(null)
const opener = ref<HTMLElement | null>(null)

watch(isOpen, (open) => {
  const el = dialog.value
  if (!el) return

  if (open) {
    // Remember who opened it, so focus can go back there rather than to the top
    // of the document.
    opener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!el.open) el.showModal()
  }
  else if (el.open) {
    el.close()
  }
})

/** Fires for Escape and for `close()`, so this is the one place state resets. */
function onClose() {
  isOpen.value = false
  opener.value?.focus()
  opener.value = null
}

/**
 * A click on the dialog element itself, rather than on its contents, is a click
 * on the backdrop — `<dialog>` gives no backdrop event of its own.
 */
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="wl"
    aria-labelledby="wl-title"
    @close="onClose"
    @click="onClick"
  >
    <div class="wl-box">
      <button type="button" class="wl-x" aria-label="Close" @click="close()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <p class="wl-eyebrow">Alpha · waiting list</p>
      <h2 id="wl-title" class="wl-title">Join the waiting list</h2>
      <p class="wl-sub">
        We are letting people in a group at a time while the alpha settles. Tell us who you are and
        what you'd run it on, and we'll email you when it's your turn.
      </p>

      <EarlyAccessForm variant="band" />
    </div>
  </dialog>
</template>

<style scoped>
.wl {
  border: 0;
  padding: 0;
  background: transparent;
  color: rgb(var(--color-foreground));

  /* `dialog:modal` already carries `inset: 0` from the UA sheet, so a width of
     100% over-constrains the box and collapses the auto margins — which pinned
     this to the top-left corner instead of centring it. An explicit width plus
     `margin: auto` centers on both axes. */
  margin: auto;
  width: min(34rem, calc(100vw - 2rem));

  /* The scroll container is `.wl-box`, NOT this element, and that is the whole
     fix for a scrollbar that flashed on every open. `.wl-box` animates in from
     `translateY(8px)`; a transformed child still contributes to its parent's
     scrollable overflow, so while the animation ran this box was 8px taller than
     its own max-height, a scrollbar appeared, and it vanished again as the
     transform resolved — measured at 6px decaying to 0 over ~100ms.
     A scroller does not gain overflow from its own transform, so moving the
     cap and the scrolling onto the box removes the flash without touching the
     animation. */
  overflow: visible;
}
.wl::backdrop {
  background: rgb(6 10 28 / 0.62);
  backdrop-filter: blur(3px);
}
/* Phones drop the backdrop blur for the same reason the hero does: it is a
   full-screen compositing layer for an effect nobody is looking at. */
@media (max-width: 700px) {
  .wl::backdrop { backdrop-filter: none; background: rgb(6 10 28 / 0.72); }
}

.wl-box {
  position: relative;
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgb(var(--color-background));
  border: 1px solid rgb(var(--color-border));
  border-radius: 16px;
  padding: 26px 26px 28px;
  box-shadow: var(--shadow-hero);
  text-align: start;
}
@media (max-width: 460px) {
  .wl-box { padding: 22px 18px 24px; border-radius: 14px; }
}

.wl[open] .wl-box {
  animation: wl-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes wl-in {
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .wl[open] .wl-box { animation: none; }
}

.wl-x {
  position: absolute;
  inset-block-start: 12px;
  inset-inline-end: 12px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgb(var(--color-muted-foreground));
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.wl-x:hover { background: rgb(var(--color-muted)); color: rgb(var(--color-foreground)); }
.wl-x svg { width: 16px; height: 16px; }

.wl-eyebrow {
  margin: 0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--color-primary));
}
.wl-title {
  margin: 8px 0 0;
  font-size: clamp(21px, 4.4vw, 25px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  padding-inline-end: 28px;
}
.wl-sub {
  margin: 10px 0 18px;
  font-size: 14px;
  line-height: 1.55;
  color: rgb(var(--color-muted-foreground));
  max-width: 42ch;
}
</style>
