export function scrollToForm() {
  const el = document.getElementById('formulario')
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  window.setTimeout(() => document.getElementById('lead-nome')?.focus({ preventScroll: true }), reduced ? 0 : 700)
}
