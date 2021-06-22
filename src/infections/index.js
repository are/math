import '../common/reset.css'
import { run } from '../common/runtime.js'
import { responsiveCanvasHook } from '../common/canvas.js'
import * as v from '../common/vector.js'
import * as noise from '../common/noise.js'

class Ball {
  position
  velocity
  color
  mass = 1

  forces = []
  friction = 0

  constructor({ position, velocity, color }) {
    this.position = position ?? v.ec(0, 0)
    this.velocity = velocity ?? v.ec(0, 0)
    this.color = 'red'
  }

  addForce(v) {
    this.forces.push(v)
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  update(dt, canvas) {
    const value = noise.perlin2(this.position.x / 10, this.position.y / 10)

    let f = this.velocity
      .clone()
      .perpendicular(value >= 0)
      .norm()
      .times(Math.abs(value) * 10 * this.velocity.magnitude())

    this.addForce(f)

    if (this.position.x < 0) {
      this.position.x = 0
      this.addForce(v.ec((-this.velocity.x / dt) * 2, 0))
    }

    if (this.position.x > canvas.width) {
      this.position.x = canvas.width
      this.addForce(v.ec((-this.velocity.x / dt) * 2, 0))
    }

    if (this.position.y < 0) {
      this.position.y = 0
      this.addForce(v.ec(0, (-this.velocity.y / dt) * 2))
    }

    if (this.position.y > canvas.height) {
      this.position.y = canvas.height
      this.addForce(v.ec(0, (-this.velocity.y / dt) * 2))
    }

    if (this.velocity.magnitude() > 85) {
      this.friction = 0.01
    } else {
      this.friction = 0
    }

    const ff = v.add(...this.forces).times(1 / this.mass)

    this.velocity.add(v.times(ff, dt))
    this.velocity.times(1 - this.friction)
    this.position.add(v.times(this.velocity, dt))

    this.forces = []
  }
}

run(async function main() {
  noise.seed(Math.random())
  const canvas = document.getElementById('app')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  const noiseCanvas = document.createElement('canvas')
  const noiseCtx = noiseCanvas.getContext('2d')

  noiseCanvas.width = window.innerWidth
  noiseCanvas.height = window.innerHeight

  const noiseData = noiseCtx.createImageData(
    noiseCanvas.width,
    noiseCanvas.height
  )

  for (let x = 0; x < window.innerWidth; x++) {
    for (let y = 0; y < window.innerHeight; y++) {
      const value = ((noise.perlin2(x / 10, y / 10) + 1) / 2) * 255
      const index = y * noiseData.width * 4 + x * 4

      noiseData.data[index] = value / 3
      noiseData.data[index + 1] = value / 3
      noiseData.data[index + 2] = value / 3
      noiseData.data[index + 3] = 60
    }
  }

  noiseCtx.putImageData(noiseData, 0, 0)

  const paused = false

  const balls = Array.from({ length: 1000 }, () => {
    const ball = new Ball({
      position: v.ec(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ),
    })

    ball.addForce(v.ec(5000, 0).rotate(Math.random() * Math.PI * 2))

    return ball
  })

  balls[1].color = 'lime'

  function update(dt) {
    for (const ball of balls) {
      ball.update(dt, canvas)
    }
  }

  function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(noiseCanvas, 0, 0)
    for (const ball of balls) {
      ball.draw(ctx)
    }
  }

  let ct = -16.6
  function loop(nt) {
    const dt = (nt - ct) / 1000
    requestAnimationFrame(loop)
    if (!paused) {
      update(dt)
      draw()
    }
    ct = nt
  }

  loop(0)

  responsiveCanvasHook(canvas, () => {})
})
