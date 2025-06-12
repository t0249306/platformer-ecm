import { Platform } from "@/components/level/platform"
import { Coin } from "@/components/level/coin"
import { Obstacle } from "@/components/level/obstacle"
import { Finish } from "@/components/level/finish"
import { BreakableRoof } from "@/components/level/breakable-roof"
import type { Camera } from "@/lib/game/camera"
import { soundManager } from "@/lib/sound-manager"

export interface LevelData {
  id: string
  name: string
  width: number
  height: number
  difficulty: 1 | 2 | 3
  playerStart: { x: number; y: number }
  platforms: Array<{ x: number; y: number; width: number; height: number }>
  coins: Array<{ x: number; y: number; radius: number }>
  obstacles: Array<{ x: number; y: number; width: number; height: number }>
  finish: { x: number; y: number; width: number; height: number }
  breakableRoof?: { x: number; y: number; width: number; height: number }
  backgroundColor?: string
}

export class Level {
  id: string
  name: string
  width: number
  height: number
  difficulty: 1 | 2 | 3
  playerStart: { x: number; y: number }
  platforms: Platform[]
  coins: Coin[]
  obstacles: Obstacle[]
  finish: Finish
  breakableRoof: BreakableRoof | null
  backgroundColor: string
  roofBreakingSoundPlayed: boolean

  constructor(data: LevelData) {
    this.id = data.id
    this.name = data.name
    this.width = data.width
    this.height = data.height
    this.difficulty = data.difficulty
    this.playerStart = data.playerStart
    this.backgroundColor = data.backgroundColor || "#1e293b"
    this.roofBreakingSoundPlayed = false

    this.platforms = data.platforms.map((p) => new Platform(p.x, p.y, p.width, p.height))
    this.coins = data.coins.map((c) => new Coin(c.x, c.y, c.radius))
    this.obstacles = data.obstacles.map((o) => new Obstacle(o.x, o.y, o.width, o.height))
    this.finish = new Finish(data.finish.x, data.finish.y, data.finish.width, data.finish.height)

    // Создаем ломающуюся крышу только если она указана в данных уровня
    this.breakableRoof = data.breakableRoof
      ? new BreakableRoof(
          data.breakableRoof.x,
          data.breakableRoof.y,
          data.breakableRoof.width,
          data.breakableRoof.height,
        )
      : null
  }

  checkPlayerOnRoof(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    if (!this.breakableRoof || this.breakableRoof.isCompletelyBroken()) {
      return false
    }

    const roofTop = this.breakableRoof.getY()
    const roofLeft = this.breakableRoof.getX()
    const roofRight = this.breakableRoof.getX() + this.breakableRoof.width

    // Проверяем, стоит ли игрок на крыше (с небольшим допуском)
    const isOnRoof =
      playerY + playerHeight <= roofTop + 5 &&
      playerY + playerHeight >= roofTop - 5 &&
      playerX + playerWidth > roofLeft &&
      playerX < roofRight

    if (isOnRoof) {
      this.breakableRoof.startBreaking()
      if (!this.roofBreakingSoundPlayed) {
        soundManager.play("death") // Используем звук смерти как звук ломания
        this.roofBreakingSoundPlayed = true
      }
      return true
    }

    return false
  }

  draw(ctx: CanvasRenderingContext2D, camera: Camera) {
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (const platform of this.platforms) {
      if (camera.isVisible(platform.getX(), platform.getY(), platform.width, platform.height)) {
        const screenPos = camera.worldToScreen(platform.getX(), platform.getY())
        platform.drawAt(ctx, screenPos.x, screenPos.y)
      }
    }

    for (const coin of this.coins) {
      if (camera.isVisible(coin.getX(), coin.getY(), coin.radius * 2, coin.radius * 2)) {
        const screenPos = camera.worldToScreen(coin.getX(), coin.getY())
        coin.drawAt(ctx, screenPos.x, screenPos.y)
      }
    }

    for (const obstacle of this.obstacles) {
      if (camera.isVisible(obstacle.getX(), obstacle.getY(), obstacle.width, obstacle.height)) {
        const screenPos = camera.worldToScreen(obstacle.getX(), obstacle.getY())
        obstacle.drawAt(ctx, screenPos.x, screenPos.y)
      }
    }

    if (camera.isVisible(this.finish.getX(), this.finish.getY(), this.finish.width, this.finish.height)) {
      const screenPos = camera.worldToScreen(this.finish.getX(), this.finish.getY())
      this.finish.drawAt(ctx, screenPos.x, screenPos.y)
    }

    // Рисуем ломающуюся крышу только если она существует
    if (this.breakableRoof && !this.breakableRoof.isCompletelyBroken()) {
      if (
        camera.isVisible(
          this.breakableRoof.getX(),
          this.breakableRoof.getY(),
          this.breakableRoof.width,
          this.breakableRoof.height,
        )
      ) {
        const screenPos = camera.worldToScreen(this.breakableRoof.getX(), this.breakableRoof.getY())
        this.breakableRoof.drawAt(ctx, screenPos.x, screenPos.y)
      }
    }
  }

  update() {
    if (this.breakableRoof) {
      this.breakableRoof.update()
    }
  }

  getTotalCoins(): number {
    return this.coins.length
  }

  removeCoin(index: number) {
    if (index >= 0 && index < this.coins.length) {
      this.coins.splice(index, 1)
    }
  }

  getMinimumCoinsForGlobalLeaderboard(): number {
    // Для попадания в глобальные топы нужно собрать минимум 15 монет
    return 15
  }

  canReachGlobalLeaderboard(coinsCollected: number): boolean {
    return coinsCollected >= this.getMinimumCoinsForGlobalLeaderboard()
  }
}