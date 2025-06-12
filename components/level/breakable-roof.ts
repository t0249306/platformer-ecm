import { LevelComponent } from "@/components/level/level-component"

export class BreakableRoof extends LevelComponent {
  x: number
  y: number
  width: number
  height: number
  isBroken: boolean
  breakProgress: number
  crackPattern: Array<{ x: number; y: number; length: number; angle: number }>

  constructor(x: number, y: number, width: number, height: number) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isBroken = false
    this.breakProgress = 0
    this.crackPattern = []
    this.generateCracks()
  }

  public getX(): number {
    return this.x
  }

  public getY(): number {
    return this.y
  }

  private generateCracks() {
    const numCracks = 8
    for (let i = 0; i < numCracks; i++) {
      this.crackPattern.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: 10 + Math.random() * 20,
        angle: Math.random() * Math.PI * 2,
      })
    }
  }

  public startBreaking() {
    if (!this.isBroken && this.breakProgress === 0) {
      this.breakProgress = 0.01
    }
  }

  public update() {
    if (this.breakProgress > 0 && this.breakProgress < 1) {
      this.breakProgress += 0.02
      if (this.breakProgress >= 1) {
        this.isBroken = true
        this.breakProgress = 1
      }
    }
  }

  public isCompletelyBroken(): boolean {
    return this.isBroken && this.breakProgress >= 1
  }

  drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    if (this.isCompletelyBroken()) {
      return
    }

    ctx.fillStyle = "#64748b"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    ctx.fillStyle = "#475569"
    for (let i = 0; i < this.width; i += 20) {
      ctx.fillRect(screenX + i, screenY, 10, this.height)
    }

    if (this.breakProgress > 0) {
      ctx.strokeStyle = "#1f2937"
      ctx.lineWidth = 2

      for (const crack of this.crackPattern) {
        const crackLength = crack.length * this.breakProgress
        const startX = screenX + crack.x
        const startY = screenY + crack.y
        const endX = startX + Math.cos(crack.angle) * crackLength
        const endY = startY + Math.sin(crack.angle) * crackLength

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        if (this.breakProgress > 0.5) {
          const branchX = startX + Math.cos(crack.angle) * crackLength * 0.6
          const branchY = startY + Math.sin(crack.angle) * crackLength * 0.6
          const branchEndX = branchX + Math.cos(crack.angle + Math.PI / 4) * crackLength * 0.3
          const branchEndY = branchY + Math.sin(crack.angle + Math.PI / 4) * crackLength * 0.3

          ctx.beginPath()
          ctx.moveTo(branchX, branchY)
          ctx.lineTo(branchEndX, branchEndY)
          ctx.stroke()
        }
      }

      if (this.breakProgress > 0.7) {
        ctx.fillStyle = `rgba(31, 41, 55, ${(this.breakProgress - 0.7) * 0.5})`
        ctx.fillRect(screenX, screenY, this.width, this.height)
      }
    }
  }
}