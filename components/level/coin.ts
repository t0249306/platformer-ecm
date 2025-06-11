import { LevelComponent } from "@/components/level/level-component"

export class Coin extends LevelComponent {
  x: number
  y: number
  radius: number
  rotation: number

  constructor(x: number, y: number, radius: number) {
    super()
    this.x = x
    this.y = y
    this.radius = radius
    this.rotation = 0
  }

  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  
  drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    this.rotation += 0.05

    ctx.save()
    ctx.translate(screenX + this.radius, screenY + this.radius)
    ctx.rotate(this.rotation)

    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = "#eab308"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2)
    ctx.fillStyle = "#facc15"
    ctx.fill()

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