import type { LevelData } from "@/lib/game/level"

class LevelRegistry {
  private levels: Map<string, LevelData> = new Map()

  register(levelData: LevelData) {
    this.levels.set(levelData.id, levelData)
  }

  get(id: string | null): LevelData | undefined {
    if (!id) return undefined
    return this.levels.get(id)
  }

  getAll(): LevelData[] {
    return Array.from(this.levels.values())
  }

  exists(id: string): boolean {
    return this.levels.has(id)
  }
}

export const levelRegistry = new LevelRegistry()

levelRegistry.register({
  id: "level1",
  name: "Первый уровень",
  difficulty: 1,
  width: 1600,
  height: 500,
  playerStart: { x: 50, y: 350 },
  platforms: [
    { x: 0, y: 460, width: 1600, height: 40 },
    { x: 200, y: 380, width: 150, height: 20 },
    { x: 400, y: 320, width: 150, height: 20 },
    { x: 600, y: 260, width: 150, height: 20 },
    { x: 800, y: 200, width: 200, height: 20 },
    { x: 1050, y: 280, width: 150, height: 20 },
    { x: 1250, y: 220, width: 150, height: 20 },
    { x: 1450, y: 160, width: 150, height: 20 },
    { x: 1300, y: 380, width: 100, height: 20 },
    { x: 50, y: 300, width: 100, height: 20 },
    { x: 900, y: 380, width: 100, height: 20 },
  ],
  coins: [
    { x: 250, y: 350, radius: 20 },
    { x: 450, y: 290, radius: 20 },
    { x: 650, y: 230, radius: 20 },
    { x: 850, y: 170, radius: 20 },
    { x: 1100, y: 250, radius: 20 },
    { x: 1300, y: 190, radius: 20 },
    { x: 100, y: 270, radius: 20 },
    { x: 950, y: 350, radius: 20 },
    { x: 1350, y: 350, radius: 20 },
  ],
  obstacles: [
    { x: 350, y: 320, width: 50, height: 20 },
    { x: 550, y: 260, width: 50, height: 20 },
    { x: 750, y: 200, width: 50, height: 20 },
    { x: 1200, y: 220, width: 50, height: 20 },
    { x: 1000, y: 280, width: 50, height: 20 },
  ],
  finish: { x: 1500, y: 110, width: 50, height: 50 },
  backgroundColor: "#1e293b",
})

levelRegistry.register({
  id: "level2",
  name: "Длинный уровень",
  difficulty: 2,
  width: 2400,
  height: 500,
  playerStart: { x: 50, y: 350 },
  platforms: [
    { x: 0, y: 460, width: 2400, height: 40 },
    { x: 150, y: 400, width: 100, height: 20 },
    { x: 300, y: 350, width: 100, height: 20 },
    { x: 450, y: 300, width: 100, height: 20 },
    { x: 600, y: 250, width: 150, height: 20 },
    { x: 800, y: 200, width: 100, height: 20 },
    { x: 950, y: 300, width: 100, height: 20 },
    { x: 1100, y: 180, width: 150, height: 20 },
    { x: 1300, y: 250, width: 100, height: 20 },
    { x: 1450, y: 320, width: 100, height: 20 },
    { x: 1600, y: 200, width: 200, height: 20 },
    { x: 1850, y: 280, width: 150, height: 20 },
    { x: 2050, y: 220, width: 150, height: 20 },
    { x: 2250, y: 160, width: 150, height: 20 },
  ],
  coins: [
    { x: 200, y: 370, radius: 20 },
    { x: 350, y: 320, radius: 20 },
    { x: 500, y: 270, radius: 20 },
    { x: 650, y: 220, radius: 20 },
    { x: 850, y: 170, radius: 20 },
    { x: 1000, y: 270, radius: 20 },
    { x: 1150, y: 150, radius: 20 },
    { x: 1350, y: 220, radius: 20 },
    { x: 1500, y: 290, radius: 20 },
    { x: 1700, y: 170, radius: 20 },
    { x: 1900, y: 250, radius: 20 },
    { x: 2100, y: 190, radius: 20 },
  ],
  obstacles: [
    { x: 250, y: 350, width: 50, height: 20 },
    { x: 750, y: 200, width: 50, height: 20 },
    { x: 1000, y: 300, width: 50, height: 20 },
    { x: 1250, y: 180, width: 50, height: 20 },
    { x: 1500, y: 320, width: 50, height: 20 },
    { x: 1800, y: 200, width: 50, height: 20 },
    { x: 2000, y: 280, width: 50, height: 20 },
  ],
  finish: { x: 2300, y: 110, width: 50, height: 50 },
  backgroundColor: "#2d1b69",
})

levelRegistry.register({
  id: "level3",
  name: "Экстремальный уровень",
  difficulty: 3,
  width: 3200,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 3200, height: 40 },
    { x: 100, y: 500, width: 80, height: 15 },
    { x: 220, y: 450, width: 60, height: 15 },
    { x: 320, y: 400, width: 80, height: 15 },
    { x: 450, y: 350, width: 60, height: 15 },
    { x: 550, y: 300, width: 80, height: 15 },
    { x: 680, y: 250, width: 60, height: 15 },
    { x: 800, y: 200, width: 100, height: 15 },
    { x: 950, y: 150, width: 80, height: 15 },
    { x: 1100, y: 200, width: 60, height: 15 },
    { x: 1200, y: 300, width: 80, height: 15 },
    { x: 1350, y: 250, width: 60, height: 15 },
    { x: 1500, y: 180, width: 100, height: 15 },
    { x: 1650, y: 120, width: 80, height: 15 },
    { x: 1800, y: 200, width: 60, height: 15 },
    { x: 1950, y: 280, width: 80, height: 15 },
    { x: 2100, y: 220, width: 100, height: 15 },
    { x: 2280, y: 160, width: 80, height: 15 },
    { x: 2450, y: 240, width: 60, height: 15 },
    { x: 2600, y: 180, width: 80, height: 15 },
    { x: 2750, y: 120, width: 100, height: 15 },
    { x: 2900, y: 200, width: 80, height: 15 },
    { x: 3050, y: 140, width: 150, height: 15 },
  ],
  coins: [
    { x: 140, y: 470, radius: 15 },
    { x: 250, y: 420, radius: 15 },
    { x: 360, y: 370, radius: 15 },
    { x: 480, y: 320, radius: 15 },
    { x: 590, y: 270, radius: 15 },
    { x: 710, y: 220, radius: 15 },
    { x: 850, y: 170, radius: 15 },
    { x: 980, y: 120, radius: 15 },
    { x: 1130, y: 170, radius: 15 },
    { x: 1240, y: 270, radius: 15 },
    { x: 1380, y: 220, radius: 15 },
    { x: 1550, y: 150, radius: 15 },
    { x: 1680, y: 90, radius: 15 },
    { x: 1830, y: 170, radius: 15 },
    { x: 1980, y: 250, radius: 15 },
    { x: 2150, y: 190, radius: 15 },
    { x: 2310, y: 130, radius: 15 },
    { x: 2480, y: 210, radius: 15 },
    { x: 2640, y: 150, radius: 15 },
    { x: 2800, y: 90, radius: 15 },
    { x: 2940, y: 170, radius: 15 },
  ],
  obstacles: [
    { x: 180, y: 450, width: 40, height: 15 },
    { x: 280, y: 400, width: 40, height: 15 },
    { x: 510, y: 350, width: 40, height: 15 },
    { x: 630, y: 300, width: 40, height: 15 },
    { x: 740, y: 250, width: 40, height: 15 },
    { x: 900, y: 200, width: 40, height: 15 },
    { x: 1030, y: 150, width: 40, height: 15 },
    { x: 1160, y: 200, width: 40, height: 15 },
    { x: 1280, y: 300, width: 40, height: 15 },
    { x: 1410, y: 250, width: 40, height: 15 },
    { x: 1600, y: 180, width: 40, height: 15 },
    { x: 1730, y: 120, width: 40, height: 15 },
    { x: 1860, y: 200, width: 40, height: 15 },
    { x: 2030, y: 280, width: 40, height: 15 },
    { x: 2200, y: 220, width: 40, height: 15 },
    { x: 2360, y: 160, width: 40, height: 15 },
    { x: 2520, y: 240, width: 40, height: 15 },
    { x: 2680, y: 180, width: 40, height: 15 },
    { x: 2850, y: 120, width: 40, height: 15 },
    { x: 3000, y: 200, width: 40, height: 15 },
  ],
  finish: { x: 3100, y: 85, width: 50, height: 55 },
  backgroundColor: "#4c1d95",
})