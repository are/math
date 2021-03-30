export function run(fn) {
  window.addEventListener(
    'load',
    () => {
      fn().catch((error) => {
        console.error(error)
      })
    },
    { once: true }
  )
}
