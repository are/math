import '../common/reset.css'
import './index.css'

import { run } from '../common/runtime'
import { responsiveCanvasHook } from '../common/canvas'
import { lerp, ilerp } from '../common/math'

function bindLabel(labelFor, onChange = () => {}) {
  const label = document.querySelector(`label[for="${labelFor}"]`)
  const format = label.dataset['format']
  const slider = document.querySelector(`input#${label.htmlFor}`)

  const update = (newX) => {
    const newValue = Number(newX ?? slider.value)
    slider.value = newValue
    label.innerHTML = format.replace('{}', newValue.toFixed(2))
    onChange(newValue)
  }

  slider.addEventListener('input', () => update())
  update()

  return update
}

function logisticalMap(x, r) {
  return r * x * (1 - x)
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

run(async () => {
  const canvas = document.querySelector('#app')
  const ctx = canvas.getContext('2d')

  let x1 = -1,
    r = -1,
    n = 0,
    x = -1

  const updateR = bindLabel('rconst', (value) => {
    n = 0
    r = value
    x = x1
  })

  bindLabel('xconst', (value) => {
    n = 0
    x1 = value
    x = x1
  })

  document.querySelector('#plot4').addEventListener('click', async () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (let sr = 3; sr < 4; sr += 0.0005) {
      updateR(sr)
      for (let i = 0; i < 1000; i++) plot()
      await delay(1)
    }
  })

  function plot() {
    const width = window.innerWidth
    const height = window.innerHeight

    const centerX = width / 2
    const centerY = height / 2

    const startX = 0
    const startY = 0

    const px = lerp(0, width, ilerp(3, 4, r))
    const py = lerp(0, height, ilerp(1, 0, x))

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(startX + px, startY + py, 1, 1)

    x = logisticalMap(x, r)
    n += 1
  }

  responsiveCanvasHook(canvas, () => {})
})
