export class Coin {
  x: number
  y: number
  radius: number
  rotation: number

  constructor(x: number, y: number, radius: number) {
    this.x = x
    this.y = y
    this.radius = radius
    this.rotation = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Update rotation
    this.rotation += 0.05

    // Draw coin
    ctx.save()
    ctx.translate(this.x + this.radius, this.y + this.radius)
    ctx.rotate(this.rotation)

    // Outer circle
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = "#eab308"
    ctx.fill()

    // Inner circle
    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2)
    ctx.fillStyle = "#facc15"
    ctx.fill()

    // Star shape
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
      const x = Math.cos(angle) * this.radius * 0.5
      const y = Math.sin(angle) * this.radius * 0.5
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fillStyle = "#fef08a"
    ctx.fill()

    ctx.restore()
  }
}