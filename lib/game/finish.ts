export class Finish {
  x: number
  y: number
  width: number
  height: number
  time: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.time = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.time += 0.05

    // Draw finish flag
    ctx.fillStyle = "#10b981"
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Draw flag pole
    ctx.fillStyle = "#6b7280"
    ctx.fillRect(this.x + 5, this.y - 50, 5, 50)

    // Draw waving flag
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.moveTo(this.x + 10, this.y - 50)

    for (let i = 0; i < 30; i++) {
      const x = this.x + 10 + i
      const y = this.y - 50 + Math.sin(this.time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    for (let i = 30; i > 0; i--) {
      const x = this.x + 10 + i
      const y = this.y - 40 + Math.sin(this.time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()

    // Draw checkered pattern
    ctx.fillStyle = "#ffffff"
    const size = 5
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(this.x + 10 + i * size, this.y - 50 + j * size, size, size)
        }
      }
    }
  }
}