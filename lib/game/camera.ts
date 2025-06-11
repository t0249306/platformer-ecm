export class Camera {
  x: number
  y: number
  width: number
  height: number
  levelWidth: number
  levelHeight: number
  followSpeed: number

  constructor(width: number, height: number, levelWidth: number, levelHeight: number) {
    this.x = 0
    this.y = 0
    this.width = width
    this.height = height
    this.levelWidth = levelWidth
    this.levelHeight = levelHeight
    this.followSpeed = 0.1
  }

  follow(targetX: number, targetY: number) {
    // Центрируем камеру на цели
    const targetCameraX = targetX - this.width / 2
    const targetCameraY = targetY - this.height / 2

    // Плавное следование
    this.x += (targetCameraX - this.x) * this.followSpeed

    // Ограничиваем камеру границами уровня
    this.x = Math.max(0, Math.min(this.levelWidth - this.width, this.x))
    this.y = Math.max(0, Math.min(this.levelHeight - this.height, this.y))
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y,
    }
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y,
    }
  }

  isVisible(x: number, y: number, width: number, height: number): boolean {
    return x + width > this.x && x < this.x + this.width && y + height > this.y && y < this.y + this.height
  }
}