export class Platform {
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
    ctx.fillStyle = "#64748b"
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Add some texture
    ctx.fillStyle = "#475569"
    for (let i = 0; i < this.width; i += 20) {
      ctx.fillRect(this.x + i, this.y, 10, this.height)
    }
  }
}