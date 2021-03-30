export function responsiveCanvasHook(canvas) {
  function adjustSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener('resize', adjustSize)

  adjustSize()
}
