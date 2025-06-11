import { LevelComponent } from "@/components/level/level-component"

export class Finish extends LevelComponent {
  x: number
  y: number
  width: number
  height: number
  time: number

  constructor(x: number, y: number, width: number, height: number) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.time = 0
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }

  drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    this.time += 0.05

    ctx.fillStyle = "#10b981"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    ctx.fillStyle = "#6b7280"
    ctx.fillRect(screenX + 5, screenY - 50, 5, 50)

    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.moveTo(screenX + 10, screenY - 50)

    for (let i = 0; i < 30; i++) {
      const x = screenX + 10 + i
      const y = screenY - 50 + Math.sin(this.time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    for (let i = 30; i > 0; i--) {
      const x = screenX + 10 + i
      const y = screenY - 40 + Math.sin(this.time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#ffffff"
    const size = 5
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(screenX + 10 + i * size, screenY - 50 + j * size, size, size)
        }
      }
    }
  }
}