import { LevelComponent } from "@/components/level/level-component"

export class Platform extends LevelComponent {
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
    ctx.fillStyle = "#64748b"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    ctx.fillStyle = "#475569"
    for (let i = 0; i < this.width; i += 20) {
      ctx.fillRect(screenX + i, screenY, 10, this.height)
    }
  }
}