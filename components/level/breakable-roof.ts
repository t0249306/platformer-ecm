import { LevelComponent } from "@/components/level/level-component"

export class BreakableRoof extends LevelComponent {
  x: number
  y: number
  width: number
  height: number
  isBroken: boolean
  breakProgress: number
  crackPattern: Array<{ x: number; y: number; length: number; angle: number }>
  finishX: number
  finishY: number
  finishWidth: number
  finishHeight: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    finishX: number,
    finishY: number,
    finishWidth: number,
    finishHeight: number,
  ) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isBroken = false
    this.breakProgress = 0
    this.crackPattern = []
    this.finishX = finishX
    this.finishY = finishY
    this.finishWidth = finishWidth
    this.finishHeight = finishHeight
    this.generateCracks()
  }

  public getX(): number {
    return this.x
  }

  public getY(): number {
    return this.y
  }

  private generateCracks() {
    const numCracks = 12
    for (let i = 0; i < numCracks; i++) {
      this.crackPattern.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: 15 + Math.random() * 25,
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
      this.breakProgress += 0.015
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
      // Рисуем только финиш если крыша полностью разрушена
      this.drawFinish(ctx, screenX, screenY)
      return
    }

    // Рисуем основной куб (стены и крышу)
    ctx.fillStyle = "#64748b"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    // Рисуем текстуру куба
    ctx.fillStyle = "#475569"
    for (let i = 0; i < this.width; i += 25) {
      ctx.fillRect(screenX + i, screenY, 12, this.height)
    }
    for (let i = 0; i < this.height; i += 25) {
      ctx.fillRect(screenX, screenY + i, this.width, 12)
    }

    // Рисуем финиш внутри куба (виден через "окно")
    const windowX = screenX + (this.width - this.finishWidth) / 2
    const windowY = screenY + (this.height - this.finishHeight) / 2

    // Темный фон "окна"
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(windowX - 5, windowY - 5, this.finishWidth + 10, this.finishHeight + 10)

    this.drawFinish(ctx, screenX, screenY)

    // Рисуем трещины если начался процесс разрушения
    if (this.breakProgress > 0) {
      ctx.strokeStyle = "#1f2937"
      ctx.lineWidth = 3

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

        // Добавляем ответвления трещин
        if (this.breakProgress > 0.4) {
          const branchX = startX + Math.cos(crack.angle) * crackLength * 0.6
          const branchY = startY + Math.sin(crack.angle) * crackLength * 0.6
          const branchEndX = branchX + Math.cos(crack.angle + Math.PI / 3) * crackLength * 0.4
          const branchEndY = branchY + Math.sin(crack.angle + Math.PI / 3) * crackLength * 0.4

          ctx.beginPath()
          ctx.moveTo(branchX, branchY)
          ctx.lineTo(branchEndX, branchEndY)
          ctx.stroke()
        }
      }

      // Эффект разрушения - затемнение
      if (this.breakProgress > 0.6) {
        ctx.fillStyle = `rgba(31, 41, 55, ${(this.breakProgress - 0.6) * 0.8})`
        ctx.fillRect(screenX, screenY, this.width, this.height)
      }

      // Эффект падающих кусков
      if (this.breakProgress > 0.8) {
        ctx.fillStyle = "#64748b"
        for (let i = 0; i < 8; i++) {
          const chunkX = screenX + Math.random() * this.width
          const chunkY = screenY + this.height + (this.breakProgress - 0.8) * 100 + i * 10
          const chunkSize = 3 + Math.random() * 5
          ctx.fillRect(chunkX, chunkY, chunkSize, chunkSize)
        }
      }
    }
  }

  private drawFinish(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    const finishScreenX = screenX + (this.width - this.finishWidth) / 2
    const finishScreenY = screenY + (this.height - this.finishHeight) / 2

    // Рисуем зеленый финишный блок
    ctx.fillStyle = "#10b981"
    ctx.fillRect(finishScreenX, finishScreenY, this.finishWidth, this.finishHeight)

    // Рисуем флагшток
    ctx.fillStyle = "#6b7280"
    ctx.fillRect(finishScreenX + 5, finishScreenY - 50, 5, 50)

    // Рисуем анимированный флаг
    const time = Date.now() * 0.005
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.moveTo(finishScreenX + 10, finishScreenY - 50)

    for (let i = 0; i < 30; i++) {
      const x = finishScreenX + 10 + i
      const y = finishScreenY - 50 + Math.sin(time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    for (let i = 30; i > 0; i--) {
      const x = finishScreenX + 10 + i
      const y = finishScreenY - 40 + Math.sin(time + i * 0.2) * 3
      ctx.lineTo(x, y)
    }

    ctx.closePath()
    ctx.fill()

    // Рисуем шахматный узор на флаге
    ctx.fillStyle = "#ffffff"
    const size = 5
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(finishScreenX + 10 + i * size, finishScreenY - 50 + j * size, size, size)
        }
      }
    }
  }
}