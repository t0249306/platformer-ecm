import { LevelComponent } from "@/components/level/level-component"

export class Obstacle extends LevelComponent {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }

  drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    ctx.fillStyle = "#b91c1c"
    ctx.beginPath()
    for (let i = 0; i < this.width; i += 10) {
      ctx.moveTo(screenX + i, screenY)
      ctx.lineTo(screenX + i + 5, screenY - 10)
      ctx.lineTo(screenX + i + 10, screenY)
    }
    ctx.fill()
  }
}