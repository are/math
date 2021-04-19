class Vector {
  x
  y

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  times(scalar) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  add(vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  rotate(rad) {
    const px = this.x
    const py = this.y

    this.x = Math.cos(rad) * px - Math.sin(rad) * py
    this.y = Math.sin(rad) * px + Math.cos(rad) * py
    return this
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  dot(other) {
    return this.x * other.x + this.y * other.y
  }

  angle(other) {
    return Math.acos(this.norm().dot(other.norm()))
  }

  perpendicular(clock = false) {
    if (clock) {
      return new Vector(this.y, -this.x)
    } else {
      return new Vector(-this.y, this.x)
    }
  }

  norm() {
    if (this.x === 0 && this.y === 0) {
      return new Vector(this.x, this.y)
    }

    return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
}

export const ec = (x, y) => new Vector(x, y)
export const zero = () => new Vector(0, 0)

export const add = (...vectors) =>
  vectors.reduce((a, v) => new Vector(a.x + v.x, a.y + v.y), zero())

export const times = (v, s) => new Vector(v.x * s, v.y * s)
