export class Obstacle {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Add spikes
    ctx.fillStyle = "#b91c1c"
    ctx.beginPath()
    for (let i = 0; i < this.width; i += 10) {
      ctx.moveTo(this.x + i, this.y)
      ctx.lineTo(this.x + i + 5, this.y - 10)
      ctx.lineTo(this.x + i + 10, this.y)
    }
    ctx.fill()
  }
}