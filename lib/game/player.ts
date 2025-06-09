import type { Platform } from "./platform"
import type { Coin } from "./coin"
import type { Obstacle } from "./obstacle"
import type { Finish } from "./finish"

export class Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  gravity: number
  friction: number
  speed: number
  jumpStrength: number
  canJump: boolean

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.velocityX = 0
    this.velocityY = 0
    this.gravity = 0.16
    this.friction = 0.8
    this.speed = 3.2
    this.jumpStrength = 5.5
    this.canJump = false
  }

  moveLeft() {
    this.velocityX = -this.speed
  }

  moveRight() {
    this.velocityX = this.speed
  }

  jump() {
    if (this.canJump) {
      this.velocityY = -this.jumpStrength
      this.canJump = false
    }
  }

  applyGravity() {
    this.velocityY += this.gravity
  }

  update(canvasWidth: number) {
    this.velocityX *= this.friction
    this.x += this.velocityX
    this.y += this.velocityY

    if (this.x < 0) {
      this.x = 0
    } else if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width
    }
  }

  checkPlatformCollision(platform: Platform): boolean {
    const overlap =
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y

    if (overlap) {
      const overlapLeft = this.x + this.width - platform.x
      const overlapRight = platform.x + platform.width - this.x
      const overlapTop = this.y + this.height - platform.y
      const overlapBottom = platform.y + platform.height - this.y

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

      if (minOverlap === overlapTop && this.velocityY >= 0) {
        this.y = platform.y - this.height
        this.velocityY = 0
        return true
      } else if (minOverlap === overlapBottom && this.velocityY < 0) {
        this.y = platform.y + platform.height
        this.velocityY = 0
      } else if (minOverlap === overlapLeft && this.velocityX > 0) {
        this.x = platform.x - this.width
        this.velocityX = 0
      } else if (minOverlap === overlapRight && this.velocityX < 0) {
        this.x = platform.x + platform.width
        this.velocityX = 0
      }
    }

    return false
  }

  checkCoinCollision(coin: Coin): boolean {
    const margin = 5
    return (
      this.x + margin < coin.x + coin.radius * 2 &&
      this.x + this.width - margin > coin.x &&
      this.y + margin < coin.y + coin.radius * 2 &&
      this.y + this.height - margin > coin.y
    )
  }

  checkObstacleCollision(obstacle: Obstacle): boolean {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    )
  }

  checkFinishCollision(finish: Finish): boolean {
    return (
      this.x + 10 < finish.x + finish.width &&
      this.x + this.width - 10 > finish.x &&
      this.y + 10 < finish.y + finish.height &&
      this.y + this.height - 10 > finish.y
    )
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(this.x, this.y, this.width, this.height)

    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.3, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.3, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.x + this.width * 0.5, this.y + this.height * 0.6, 10, 0, Math.PI)
    ctx.stroke()
  }
}
