export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

export function ilerp(v0, v1, t) {
  return (t - v0) / (v1 - v0)
}
