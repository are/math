export function responsiveCanvasHook(canvas, fn) {
  function adjustSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    fn()
  }

  window.addEventListener('resize', adjustSize)

  adjustSize()
}
