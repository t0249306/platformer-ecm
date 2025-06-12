import type { Platform } from "@/components/level/platform"
import type { Coin } from "@/components/level/coin"
import type { Obstacle } from "@/components/level/obstacle"
import type { Finish } from "@/components/level/finish"

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
    this.jumpStrength = 5.8
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

  update(levelWidth: number) {
    this.velocityX *= this.friction
    this.x += this.velocityX
    this.y += this.velocityY

    if (this.x < 0) {
      this.x = 0
    } else if (this.x + this.width > levelWidth) {
      this.x = levelWidth - this.width
    }
  }

  checkPlatformCollision(platform: Platform): boolean {
    const overlap =
      this.x < platform.getX() + platform.width &&
      this.x + this.width > platform.getX() &&
      this.y < platform.getY() + platform.height &&
      this.y + this.height > platform.getY()

    if (overlap) {
      const overlapLeft = this.x + this.width - platform.getX()
      const overlapRight = platform.getX() + platform.width - this.x
      const overlapTop = this.y + this.height - platform.getY()
      const overlapBottom = platform.getY() + platform.height - this.y

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

      if (minOverlap === overlapTop && this.velocityY >= 0) {
        this.y = platform.getY() - this.height
        this.velocityY = 0
        return true
      } else if (minOverlap === overlapBottom && this.velocityY < 0) {
        this.y = platform.getY() + platform.height
        this.velocityY = 0
      } else if (minOverlap === overlapLeft && this.velocityX > 0) {
        this.x = platform.getX() - this.width
        this.velocityX = 0
      } else if (minOverlap === overlapRight && this.velocityX < 0) {
        this.x = platform.getX() + platform.width
        this.velocityX = 0
      }
    }

    return false
  }

  checkHeadCollision(platforms: Platform[], obstacles: Obstacle[]): boolean {
    const headCheckHeight = 3
    const headCheckArea = {
      x: this.x + this.width * 0.25,
      y: this.y - headCheckHeight,
      width: this.width * 0.5,
      height: headCheckHeight,
    }

    for (const platform of platforms) {
      if (
        headCheckArea.x < platform.getX() + platform.width &&
        headCheckArea.x + headCheckArea.width > platform.getX() &&
        headCheckArea.y < platform.getY() + platform.height &&
        headCheckArea.y + headCheckArea.height > platform.getY()
      ) {
        return true
      }
    }

    for (const obstacle of obstacles) {
      if (
        headCheckArea.x < obstacle.getX() + obstacle.width &&
        headCheckArea.x + headCheckArea.width > obstacle.getX() &&
        headCheckArea.y < obstacle.getY() + obstacle.height &&
        headCheckArea.y + headCheckArea.height > obstacle.getY()
      ) {
        return true
      }
    }

    return false
  }

  checkCoinCollision(coin: Coin): boolean {
    const margin = 5
    return (
      this.x + margin < coin.getX() + coin.radius * 2 &&
      this.x + this.width - margin > coin.getX() &&
      this.y + margin < coin.getY() + coin.radius * 2 &&
      this.y + this.height - margin > coin.getY()
    )
  }

  checkObstacleCollision(obstacle: Obstacle): boolean {
    const margin = 2
    return (
      this.x + margin < obstacle.getX() + obstacle.width &&
      this.x + this.width - margin > obstacle.getX() &&
      this.y + margin < obstacle.getY() + obstacle.height &&
      this.y + this.height - margin > obstacle.getY()
    )
  }

  checkFinishCollision(finish: Finish): boolean {
    return (
      this.x + 10 < finish.getX() + finish.width &&
      this.x + this.width - 10 > finish.getX() &&
      this.y + 10 < finish.getY() + finish.height &&
      this.y + this.height - 10 > finish.getY()
    )
  }

  drawAt(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(screenX, screenY, this.width, this.height)

    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(screenX + this.width * 0.3, screenY + this.height * 0.3, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(screenX + this.width * 0.7, screenY + this.height * 0.3, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(screenX + this.width * 0.5, screenY + this.height * 0.6, 10, 0, Math.PI)
    ctx.stroke()
  }
}