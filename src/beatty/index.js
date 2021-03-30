import '../common/reset.css'

import { run } from '../common/runtime.js'
import { responsiveCanvasHook } from '../common/canvas.js'

import anime from 'animejs'

function makePoint() {
  return { opacity: 0, textOpacity: 0 }
}

function drawBackground(ctx) {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function drawNumberLine(ctx, { scale, width }) {
  const centerX = ctx.canvas.width / 2
  const centerY = ctx.canvas.height / 2

  const stretch = scale * (ctx.canvas.width / 2)

  ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + scale / 2})`
  ctx.fillRect(centerX - stretch, centerY - width / 2, stretch * 2, width)
}

function drawPoints(ctx, points) {
  const centerY = ctx.canvas.height / 2
  const spaceBetween = ctx.canvas.width / points.length
  const pointWidth = 4
  const pointHeight = 20

  for (const [i, { opacity, textOpacity }] of points.entries()) {
    const positionX = spaceBetween * i + spaceBetween / 2

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.fillRect(
      positionX - pointWidth / 2,
      centerY - pointHeight / 2,
      pointWidth,
      pointHeight
    )

    ctx.font = 'bold 28px Georgia'
    ctx.textAlign = 'center'
    ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
    ctx.fillText(`${i}`, positionX, centerY + 40)
  }
}

function draw(ctx, state) {
  drawBackground(ctx)
  drawNumberLine(ctx, state.numberLine)
  drawPoints(ctx, state.points)
}

run(async function main() {
  const canvas = document.getElementById('app')
  const ctx = canvas.getContext('2d')

  responsiveCanvasHook(canvas)

  const state = {
    numberLine: { scale: 0, width: 4 },
    points: [
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
      makePoint(),
    ],
  }

  const timeline = anime.timeline({
    update: () => draw(ctx, state),
  })

  timeline.add({
    targets: state.numberLine,

    scale: 1,

    easing: 'easeInQuint',
    duration: 1000,
  })

  timeline.add({
    targets: state.points,

    opacity: 1,

    easing: 'linear',
    duration: 1000,
    delay: anime.stagger(100, { from: 'center' }),
  })

  timeline.add({
    targets: state.points,

    textOpacity: 1,

    easing: 'linear',
    duration: 1000,
    delay: anime.stagger(100, { from: 'first' }),
  })
})
