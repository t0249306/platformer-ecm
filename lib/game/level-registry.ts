import type { LevelData } from "@/lib/game/level"

export interface WorldData {
  id: string
  name: string
  description: string
  color: string
  icon: string
  levels: string[]
}

class LevelRegistry {
  private levels: Map<string, LevelData> = new Map()
  private worlds: Map<string, WorldData> = new Map()

  register(levelData: LevelData) {
    this.levels.set(levelData.id, levelData)
  }

  registerWorld(worldData: WorldData) {
    this.worlds.set(worldData.id, worldData)
  }

  get(id: string | null): LevelData | undefined {
    if (!id) return undefined
    return this.levels.get(id)
  }

  getWorld(id: string): WorldData | undefined {
    return this.worlds.get(id)
  }

  getAll(): LevelData[] {
    return Array.from(this.levels.values())
  }

  getAllWorlds(): WorldData[] {
    return Array.from(this.worlds.values())
  }

  getLevelsByWorld(worldId: string): LevelData[] {
    const world = this.worlds.get(worldId)
    if (!world) return []
    return world.levels.map((levelId) => this.levels.get(levelId)).filter(Boolean) as LevelData[]
  }

  exists(id: string): boolean {
    return this.levels.has(id)
  }
}

export const levelRegistry = new LevelRegistry()

// Регистрация миров
levelRegistry.registerWorld({
  id: "normal",
  name: "Обычный мир",
  description: "Простые уровни для изучения основ",
  color: "#22c55e",
  icon: "🌱",
  levels: ["level1", "level2", "level3"],
})

levelRegistry.registerWorld({
  id: "hell",
  name: "Адские земли",
  description: "Опасные уровни с лавой и огнем",
  color: "#ef4444",
  icon: "🔥",
  levels: ["hell1", "hell2", "hell3"],
})

levelRegistry.registerWorld({
  id: "ice",
  name: "Ледяной мир",
  description: "Скользкие платформы и ледяные препятствия",
  color: "#3b82f6",
  icon: "❄️",
  levels: ["ice1", "ice2"],
})

levelRegistry.registerWorld({
  id: "space",
  name: "Космос",
  description: "Невесомость и космические препятствия",
  color: "#8b5cf6",
  icon: "🚀",
  levels: ["space1"],
})

// Обычный мир
levelRegistry.register({
  id: "level1",
  name: "Первые шаги",
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
  name: "Длинный путь",
  difficulty: 2,
  width: 2400,
  height: 500,
  playerStart: { x: 50, y: 350 },
  platforms: [
    { x: 0, y: 460, width: 2400, height: 40 },
    // Простой путь (нижний)
    { x: 150, y: 400, width: 100, height: 20 },
    { x: 300, y: 400, width: 100, height: 20 },
    { x: 450, y: 400, width: 100, height: 20 },
    { x: 600, y: 400, width: 100, height: 20 },
    { x: 750, y: 400, width: 100, height: 20 },
    { x: 900, y: 400, width: 100, height: 20 },
    { x: 1050, y: 400, width: 100, height: 20 },
    { x: 1200, y: 400, width: 100, height: 20 },
    { x: 1350, y: 400, width: 100, height: 20 },
    { x: 1500, y: 400, width: 100, height: 20 },
    { x: 1650, y: 400, width: 100, height: 20 },
    { x: 1800, y: 400, width: 100, height: 20 },
    { x: 1950, y: 400, width: 100, height: 20 },
    { x: 2100, y: 400, width: 100, height: 20 },
    { x: 2250, y: 400, width: 150, height: 20 },

    // Сложный путь (верхний)
    { x: 200, y: 300, width: 80, height: 20 },
    { x: 320, y: 250, width: 80, height: 20 },
    { x: 440, y: 200, width: 80, height: 20 },
    { x: 560, y: 150, width: 80, height: 20 },
    { x: 680, y: 200, width: 80, height: 20 },
    { x: 800, y: 250, width: 80, height: 20 },
    { x: 920, y: 200, width: 80, height: 20 },
    { x: 1040, y: 150, width: 80, height: 20 },
    { x: 1160, y: 200, width: 80, height: 20 },
    { x: 1280, y: 250, width: 80, height: 20 },
    { x: 1400, y: 200, width: 80, height: 20 },
    { x: 1520, y: 150, width: 80, height: 20 },
    { x: 1640, y: 200, width: 80, height: 20 },
    { x: 1760, y: 250, width: 80, height: 20 },
    { x: 1880, y: 200, width: 80, height: 20 },
    { x: 2000, y: 150, width: 80, height: 20 },
    { x: 2120, y: 200, width: 80, height: 20 },

    // Соединение путей
    { x: 2200, y: 300, width: 100, height: 20 },

    // Финишная постройка
    { x: 2300, y: 260, width: 200, height: 40 }, // Основание постройки
    { x: 2350, y: 220, width: 100, height: 40 }, // Средняя часть
  ],
  coins: [
    // Простой путь (меньше монет)
    { x: 200, y: 370, radius: 20 },
    { x: 350, y: 370, radius: 20 },
    { x: 500, y: 370, radius: 20 },
    { x: 650, y: 370, radius: 20 },
    { x: 800, y: 370, radius: 20 },
    { x: 950, y: 370, radius: 20 },
    { x: 1100, y: 370, radius: 20 },
    { x: 1250, y: 370, radius: 20 },
    { x: 1400, y: 370, radius: 20 },
    { x: 1550, y: 370, radius: 20 },
    { x: 1700, y: 370, radius: 20 },
    { x: 1850, y: 370, radius: 20 },
    { x: 2000, y: 370, radius: 20 }, // 13 монет

    // Сложный путь (больше монет)
    { x: 240, y: 270, radius: 20 },
    { x: 360, y: 220, radius: 20 },
    { x: 480, y: 170, radius: 20 },
    { x: 600, y: 120, radius: 20 },
    { x: 720, y: 170, radius: 20 },
    { x: 840, y: 220, radius: 20 },
    { x: 960, y: 170, radius: 20 },
    { x: 1080, y: 120, radius: 20 },
    { x: 1200, y: 170, radius: 20 },
    { x: 1320, y: 220, radius: 20 },
    { x: 1440, y: 170, radius: 20 },
    { x: 1560, y: 120, radius: 20 },
    { x: 1680, y: 170, radius: 20 },
    { x: 1800, y: 220, radius: 20 },
    { x: 1920, y: 170, radius: 20 },
    { x: 2040, y: 120, radius: 20 },
    { x: 2160, y: 170, radius: 20 }, // 17 монет
  ],
  obstacles: [
    // Простой путь
    { x: 250, y: 400, width: 50, height: 20 },
    { x: 700, y: 400, width: 50, height: 20 },
    { x: 1150, y: 400, width: 50, height: 20 },
    { x: 1600, y: 400, width: 50, height: 20 },

    // Сложный путь
    { x: 280, y: 300, width: 40, height: 20 },
    { x: 400, y: 250, width: 40, height: 20 },
    { x: 520, y: 200, width: 40, height: 20 },
    { x: 640, y: 150, width: 40, height: 20 },
    { x: 760, y: 200, width: 40, height: 20 },
    { x: 880, y: 250, width: 40, height: 20 },
    { x: 1000, y: 200, width: 40, height: 20 },
    { x: 1120, y: 150, width: 40, height: 20 },
    { x: 1240, y: 200, width: 40, height: 20 },
    { x: 1360, y: 250, width: 40, height: 20 },
    { x: 1480, y: 200, width: 40, height: 20 },
    { x: 1600, y: 150, width: 40, height: 20 },
    { x: 1720, y: 200, width: 40, height: 20 },
    { x: 1840, y: 250, width: 40, height: 20 },
    { x: 1960, y: 200, width: 40, height: 20 },
    { x: 2080, y: 150, width: 40, height: 20 },
  ],
  finish: { x: 2375, y: 170, width: 50, height: 50 },
  breakableRoof: { x: 2300, y: 210, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#2d1b69",
})

levelRegistry.register({
  id: "level3",
  name: "Экстремальный вызов",
  difficulty: 3,
  width: 3200,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 3200, height: 40 },
    // Простой путь
    { x: 100, y: 500, width: 100, height: 20 },
    { x: 250, y: 500, width: 100, height: 20 },
    { x: 400, y: 500, width: 100, height: 20 },
    { x: 550, y: 500, width: 100, height: 20 },
    { x: 700, y: 500, width: 100, height: 20 },
    { x: 850, y: 500, width: 100, height: 20 },
    { x: 1000, y: 500, width: 100, height: 20 },
    { x: 1150, y: 500, width: 100, height: 20 },
    { x: 1300, y: 500, width: 100, height: 20 },
    { x: 1450, y: 500, width: 100, height: 20 },
    { x: 1600, y: 500, width: 100, height: 20 },
    { x: 1750, y: 500, width: 100, height: 20 },
    { x: 1900, y: 500, width: 100, height: 20 },
    { x: 2050, y: 500, width: 100, height: 20 },
    { x: 2200, y: 500, width: 100, height: 20 },
    { x: 2350, y: 500, width: 100, height: 20 },
    { x: 2500, y: 500, width: 100, height: 20 },
    { x: 2650, y: 500, width: 100, height: 20 },
    { x: 2800, y: 500, width: 100, height: 20 },
    { x: 2950, y: 500, width: 100, height: 20 },

    // Сложный путь (верхний)
    { x: 120, y: 400, width: 60, height: 15 },
    { x: 220, y: 350, width: 60, height: 15 },
    { x: 320, y: 300, width: 60, height: 15 },
    { x: 420, y: 250, width: 60, height: 15 },
    { x: 520, y: 200, width: 60, height: 15 },
    { x: 620, y: 150, width: 60, height: 15 },
    { x: 720, y: 200, width: 60, height: 15 },
    { x: 820, y: 250, width: 60, height: 15 },
    { x: 920, y: 200, width: 60, height: 15 },
    { x: 1020, y: 150, width: 60, height: 15 },
    { x: 1120, y: 200, width: 60, height: 15 },
    { x: 1220, y: 250, width: 60, height: 15 },
    { x: 1320, y: 200, width: 60, height: 15 },
    { x: 1420, y: 150, width: 60, height: 15 },
    { x: 1520, y: 200, width: 60, height: 15 },
    { x: 1620, y: 250, width: 60, height: 15 },
    { x: 1720, y: 200, width: 60, height: 15 },
    { x: 1820, y: 150, width: 60, height: 15 },
    { x: 1920, y: 200, width: 60, height: 15 },
    { x: 2020, y: 250, width: 60, height: 15 },
    { x: 2120, y: 200, width: 60, height: 15 },
    { x: 2220, y: 150, width: 60, height: 15 },
    { x: 2320, y: 200, width: 60, height: 15 },
    { x: 2420, y: 250, width: 60, height: 15 },
    { x: 2520, y: 200, width: 60, height: 15 },
    { x: 2620, y: 150, width: 60, height: 15 },
    { x: 2720, y: 200, width: 60, height: 15 },
    { x: 2820, y: 250, width: 60, height: 15 },
    { x: 2920, y: 200, width: 60, height: 15 },

    // Соединение путей
    { x: 3000, y: 400, width: 100, height: 20 },

    // Финишная постройка с ломающейся крышей
    { x: 3050, y: 240, width: 200, height: 60 }, // Основание
    { x: 3100, y: 180, width: 100, height: 60 }, // Средняя часть
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 150, y: 470, radius: 15 },
    { x: 300, y: 470, radius: 15 },
    { x: 450, y: 470, radius: 15 },
    { x: 600, y: 470, radius: 15 },
    { x: 750, y: 470, radius: 15 },
    { x: 900, y: 470, radius: 15 },
    { x: 1050, y: 470, radius: 15 },
    { x: 1200, y: 470, radius: 15 },
    { x: 1350, y: 470, radius: 15 },
    { x: 1500, y: 470, radius: 15 },
    { x: 1650, y: 470, radius: 15 },
    { x: 1800, y: 470, radius: 15 },
    { x: 1950, y: 470, radius: 15 },

    // Сложный путь (17 монет)
    { x: 150, y: 370, radius: 15 },
    { x: 250, y: 320, radius: 15 },
    { x: 350, y: 270, radius: 15 },
    { x: 450, y: 220, radius: 15 },
    { x: 550, y: 170, radius: 15 },
    { x: 650, y: 120, radius: 15 },
    { x: 750, y: 170, radius: 15 },
    { x: 850, y: 220, radius: 15 },
    { x: 950, y: 170, radius: 15 },
    { x: 1050, y: 120, radius: 15 },
    { x: 1150, y: 170, radius: 15 },
    { x: 1250, y: 220, radius: 15 },
    { x: 1350, y: 170, radius: 15 },
    { x: 1450, y: 120, radius: 15 },
    { x: 1550, y: 170, radius: 15 },
    { x: 1650, y: 220, radius: 15 },
    { x: 1750, y: 170, radius: 15 },
  ],
  obstacles: [
    // Простой путь
    { x: 200, y: 500, width: 50, height: 15 },
    { x: 500, y: 500, width: 50, height: 15 },
    { x: 800, y: 500, width: 50, height: 15 },
    { x: 1100, y: 500, width: 50, height: 15 },
    { x: 1400, y: 500, width: 50, height: 15 },
    { x: 1700, y: 500, width: 50, height: 15 },
    { x: 2000, y: 500, width: 50, height: 15 },
    { x: 2300, y: 500, width: 50, height: 15 },
    { x: 2600, y: 500, width: 50, height: 15 },
    { x: 2900, y: 500, width: 50, height: 15 },

    // Сложный путь
    { x: 180, y: 400, width: 40, height: 15 },
    { x: 280, y: 350, width: 40, height: 15 },
    { x: 380, y: 300, width: 40, height: 15 },
    { x: 480, y: 250, width: 40, height: 15 },
    { x: 580, y: 200, width: 40, height: 15 },
    { x: 680, y: 150, width: 40, height: 15 },
    { x: 780, y: 200, width: 40, height: 15 },
    { x: 880, y: 250, width: 40, height: 15 },
    { x: 980, y: 200, width: 40, height: 15 },
    { x: 1080, y: 150, width: 40, height: 15 },
    { x: 1180, y: 200, width: 40, height: 15 },
    { x: 1280, y: 250, width: 40, height: 15 },
    { x: 1380, y: 200, width: 40, height: 15 },
    { x: 1480, y: 150, width: 40, height: 15 },
    { x: 1580, y: 200, width: 40, height: 15 },
    { x: 1680, y: 250, width: 40, height: 15 },
    { x: 1780, y: 200, width: 40, height: 15 },
  ],
  finish: { x: 3125, y: 130, width: 50, height: 50 },
  breakableRoof: { x: 3050, y: 170, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#4c1d95",
})

// Адские земли
levelRegistry.register({
  id: "hell1",
  name: "Врата ада",
  difficulty: 2,
  width: 2000,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 2000, height: 40 },
    // Простой путь
    { x: 150, y: 480, width: 120, height: 20 },
    { x: 320, y: 480, width: 120, height: 20 },
    { x: 490, y: 480, width: 120, height: 20 },
    { x: 660, y: 480, width: 120, height: 20 },
    { x: 830, y: 480, width: 120, height: 20 },
    { x: 1000, y: 480, width: 120, height: 20 },
    { x: 1170, y: 480, width: 120, height: 20 },
    { x: 1340, y: 480, width: 120, height: 20 },
    { x: 1510, y: 480, width: 120, height: 20 },
    { x: 1680, y: 480, width: 120, height: 20 },

    // Сложный путь
    { x: 200, y: 380, width: 80, height: 20 },
    { x: 320, y: 320, width: 80, height: 20 },
    { x: 440, y: 260, width: 80, height: 20 },
    { x: 560, y: 200, width: 80, height: 20 },
    { x: 680, y: 260, width: 80, height: 20 },
    { x: 800, y: 320, width: 80, height: 20 },
    { x: 920, y: 260, width: 80, height: 20 },
    { x: 1040, y: 200, width: 80, height: 20 },
    { x: 1160, y: 260, width: 80, height: 20 },
    { x: 1280, y: 320, width: 80, height: 20 },
    { x: 1400, y: 260, width: 80, height: 20 },
    { x: 1520, y: 200, width: 80, height: 20 },
    { x: 1640, y: 260, width: 80, height: 20 },

    // Соединение
    { x: 1760, y: 380, width: 100, height: 20 },

    // Финишная постройка
    { x: 1850, y: 320, width: 150, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 210, y: 450, radius: 20 },
    { x: 380, y: 450, radius: 20 },
    { x: 550, y: 450, radius: 20 },
    { x: 720, y: 450, radius: 20 },
    { x: 890, y: 450, radius: 20 },
    { x: 1060, y: 450, radius: 20 },
    { x: 1230, y: 450, radius: 20 },
    { x: 1400, y: 450, radius: 20 },
    { x: 1570, y: 450, radius: 20 },
    { x: 1740, y: 450, radius: 20 },
    { x: 1810, y: 350, radius: 20 },
    { x: 1880, y: 290, radius: 20 },
    { x: 1950, y: 290, radius: 20 },

    // Сложный путь (17 монет)
    { x: 240, y: 350, radius: 20 },
    { x: 360, y: 290, radius: 20 },
    { x: 480, y: 230, radius: 20 },
    { x: 600, y: 170, radius: 20 },
    { x: 720, y: 230, radius: 20 },
    { x: 840, y: 290, radius: 20 },
    { x: 960, y: 230, radius: 20 },
    { x: 1080, y: 170, radius: 20 },
    { x: 1200, y: 230, radius: 20 },
    { x: 1320, y: 290, radius: 20 },
    { x: 1440, y: 230, radius: 20 },
    { x: 1560, y: 170, radius: 20 },
    { x: 1680, y: 230, radius: 20 },
    { x: 1800, y: 350, radius: 20 },
    { x: 1870, y: 290, radius: 20 },
    { x: 1920, y: 290, radius: 20 },
    { x: 1970, y: 290, radius: 20 },
  ],
  obstacles: [
    // Простой путь
    { x: 270, y: 480, width: 50, height: 30 },
    { x: 610, y: 480, width: 50, height: 30 },
    { x: 950, y: 480, width: 50, height: 30 },
    { x: 1290, y: 480, width: 50, height: 30 },
    { x: 1630, y: 480, width: 50, height: 30 },

    // Сложный путь
    { x: 280, y: 380, width: 40, height: 25 },
    { x: 400, y: 320, width: 40, height: 25 },
    { x: 520, y: 260, width: 40, height: 25 },
    { x: 640, y: 200, width: 40, height: 25 },
    { x: 760, y: 260, width: 40, height: 25 },
    { x: 880, y: 320, width: 40, height: 25 },
    { x: 1000, y: 260, width: 40, height: 25 },
    { x: 1120, y: 200, width: 40, height: 25 },
    { x: 1240, y: 260, width: 40, height: 25 },
    { x: 1360, y: 320, width: 40, height: 25 },
    { x: 1480, y: 260, width: 40, height: 25 },
    { x: 1600, y: 200, width: 40, height: 25 },
  ],
  finish: { x: 1900, y: 270, width: 50, height: 50 },
  backgroundColor: "#7f1d1d",
})

levelRegistry.register({
  id: "hell2",
  name: "Лавовые реки",
  difficulty: 3,
  width: 2500,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 2500, height: 40 },
    // Простой путь
    { x: 100, y: 480, width: 100, height: 20 },
    { x: 250, y: 480, width: 100, height: 20 },
    { x: 400, y: 480, width: 100, height: 20 },
    { x: 550, y: 480, width: 100, height: 20 },
    { x: 700, y: 480, width: 100, height: 20 },
    { x: 850, y: 480, width: 100, height: 20 },
    { x: 1000, y: 480, width: 100, height: 20 },
    { x: 1150, y: 480, width: 100, height: 20 },
    { x: 1300, y: 480, width: 100, height: 20 },
    { x: 1450, y: 480, width: 100, height: 20 },
    { x: 1600, y: 480, width: 100, height: 20 },
    { x: 1750, y: 480, width: 100, height: 20 },
    { x: 1900, y: 480, width: 100, height: 20 },
    { x: 2050, y: 480, width: 100, height: 20 },
    { x: 2200, y: 480, width: 100, height: 20 },

    // Сложный путь
    { x: 120, y: 380, width: 60, height: 15 },
    { x: 220, y: 320, width: 60, height: 15 },
    { x: 320, y: 260, width: 60, height: 15 },
    { x: 420, y: 200, width: 60, height: 15 },
    { x: 520, y: 260, width: 60, height: 15 },
    { x: 620, y: 320, width: 60, height: 15 },
    { x: 720, y: 260, width: 60, height: 15 },
    { x: 820, y: 200, width: 60, height: 15 },
    { x: 920, y: 260, width: 60, height: 15 },
    { x: 1020, y: 320, width: 60, height: 15 },
    { x: 1120, y: 260, width: 60, height: 15 },
    { x: 1220, y: 200, width: 60, height: 15 },
    { x: 1320, y: 260, width: 60, height: 15 },
    { x: 1420, y: 320, width: 60, height: 15 },
    { x: 1520, y: 260, width: 60, height: 15 },
    { x: 1620, y: 200, width: 60, height: 15 },
    { x: 1720, y: 260, width: 60, height: 15 },
    { x: 1820, y: 320, width: 60, height: 15 },
    { x: 1920, y: 260, width: 60, height: 15 },
    { x: 2020, y: 200, width: 60, height: 15 },
    { x: 2120, y: 260, width: 60, height: 15 },
    { x: 2220, y: 320, width: 60, height: 15 },

    // Соединение
    { x: 2300, y: 400, width: 100, height: 20 },

    // Финишная постройка с ломающейся крышей
    { x: 2350, y: 240, width: 200, height: 60 },
    { x: 2400, y: 180, width: 100, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 150, y: 450, radius: 15 },
    { x: 300, y: 450, radius: 15 },
    { x: 450, y: 450, radius: 15 },
    { x: 600, y: 450, radius: 15 },
    { x: 750, y: 450, radius: 15 },
    { x: 900, y: 450, radius: 15 },
    { x: 1050, y: 450, radius: 15 },
    { x: 1200, y: 450, radius: 15 },
    { x: 1350, y: 450, radius: 15 },
    { x: 1500, y: 450, radius: 15 },
    { x: 1650, y: 450, radius: 15 },
    { x: 1800, y: 450, radius: 15 },
    { x: 1950, y: 450, radius: 15 },

    // Сложный путь (17 монет)
    { x: 150, y: 350, radius: 15 },
    { x: 250, y: 290, radius: 15 },
    { x: 350, y: 230, radius: 15 },
    { x: 450, y: 170, radius: 15 },
    { x: 550, y: 230, radius: 15 },
    { x: 650, y: 290, radius: 15 },
    { x: 750, y: 230, radius: 15 },
    { x: 850, y: 170, radius: 15 },
    { x: 950, y: 230, radius: 15 },
    { x: 1050, y: 290, radius: 15 },
    { x: 1150, y: 230, radius: 15 },
    { x: 1250, y: 170, radius: 15 },
    { x: 1350, y: 230, radius: 15 },
    { x: 1450, y: 290, radius: 15 },
    { x: 1550, y: 230, radius: 15 },
    { x: 1650, y: 170, radius: 15 },
    { x: 1750, y: 230, radius: 15 },
  ],
  obstacles: [
    // Простой путь
    { x: 200, y: 480, width: 50, height: 25 },
    { x: 500, y: 480, width: 50, height: 25 },
    { x: 800, y: 480, width: 50, height: 25 },
    { x: 1100, y: 480, width: 50, height: 25 },
    { x: 1400, y: 480, width: 50, height: 25 },
    { x: 1700, y: 480, width: 50, height: 25 },
    { x: 2000, y: 480, width: 50, height: 25 },

    // Сложный путь
    { x: 180, y: 380, width: 40, height: 25 },
    { x: 280, y: 320, width: 40, height: 25 },
    { x: 380, y: 260, width: 40, height: 25 },
    { x: 480, y: 200, width: 40, height: 25 },
    { x: 580, y: 260, width: 40, height: 25 },
    { x: 680, y: 320, width: 40, height: 25 },
    { x: 780, y: 260, width: 40, height: 25 },
    { x: 880, y: 200, width: 40, height: 25 },
    { x: 980, y: 260, width: 40, height: 25 },
    { x: 1080, y: 320, width: 40, height: 25 },
    { x: 1180, y: 260, width: 40, height: 25 },
    { x: 1280, y: 200, width: 40, height: 25 },
    { x: 1380, y: 260, width: 40, height: 25 },
    { x: 1480, y: 320, width: 40, height: 25 },
    { x: 1580, y: 260, width: 40, height: 25 },
    { x: 1680, y: 200, width: 40, height: 25 },
    { x: 1780, y: 260, width: 40, height: 25 },
    { x: 1880, y: 320, width: 40, height: 25 },
    { x: 1980, y: 260, width: 40, height: 25 },
    { x: 2080, y: 200, width: 40, height: 25 },
    { x: 2180, y: 260, width: 40, height: 25 },
  ],
  finish: { x: 2425, y: 130, width: 50, height: 50 },
  breakableRoof: { x: 2350, y: 170, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#991b1b",
})

levelRegistry.register({
  id: "hell3",
  name: "Сердце ада",
  difficulty: 3,
  width: 3000,
  height: 700,
  playerStart: { x: 50, y: 550 },
  platforms: [
    { x: 0, y: 660, width: 3000, height: 40 },
    // Простой путь
    { x: 100, y: 580, width: 100, height: 20 },
    { x: 250, y: 580, width: 100, height: 20 },
    { x: 400, y: 580, width: 100, height: 20 },
    { x: 550, y: 580, width: 100, height: 20 },
    { x: 700, y: 580, width: 100, height: 20 },
    { x: 850, y: 580, width: 100, height: 20 },
    { x: 1000, y: 580, width: 100, height: 20 },
    { x: 1150, y: 580, width: 100, height: 20 },
    { x: 1300, y: 580, width: 100, height: 20 },
    { x: 1450, y: 580, width: 100, height: 20 },
    { x: 1600, y: 580, width: 100, height: 20 },
    { x: 1750, y: 580, width: 100, height: 20 },
    { x: 1900, y: 580, width: 100, height: 20 },
    { x: 2050, y: 580, width: 100, height: 20 },
    { x: 2200, y: 580, width: 100, height: 20 },
    { x: 2350, y: 580, width: 100, height: 20 },
    { x: 2500, y: 580, width: 100, height: 20 },
    { x: 2650, y: 580, width: 100, height: 20 },

    // Сложный путь
    { x: 120, y: 480, width: 60, height: 15 },
    { x: 220, y: 420, width: 60, height: 15 },
    { x: 320, y: 360, width: 60, height: 15 },
    { x: 420, y: 300, width: 60, height: 15 },
    { x: 520, y: 240, width: 60, height: 15 },
    { x: 620, y: 180, width: 60, height: 15 },
    { x: 720, y: 240, width: 60, height: 15 },
    { x: 820, y: 300, width: 60, height: 15 },
    { x: 920, y: 240, width: 60, height: 15 },
    { x: 1020, y: 180, width: 60, height: 15 },
    { x: 1120, y: 240, width: 60, height: 15 },
    { x: 1220, y: 300, width: 60, height: 15 },
    { x: 1320, y: 240, width: 60, height: 15 },
    { x: 1420, y: 180, width: 60, height: 15 },
    { x: 1520, y: 240, width: 60, height: 15 },
    { x: 1620, y: 300, width: 60, height: 15 },
    { x: 1720, y: 240, width: 60, height: 15 },
    { x: 1820, y: 180, width: 60, height: 15 },
    { x: 1920, y: 240, width: 60, height: 15 },
    { x: 2020, y: 300, width: 60, height: 15 },
    { x: 2120, y: 240, width: 60, height: 15 },
    { x: 2220, y: 180, width: 60, height: 15 },
    { x: 2320, y: 240, width: 60, height: 15 },
    { x: 2420, y: 300, width: 60, height: 15 },
    { x: 2520, y: 240, width: 60, height: 15 },
    { x: 2620, y: 180, width: 60, height: 15 },

    // Соединение
    { x: 2700, y: 480, width: 100, height: 20 },

    // Финишная постройка
    { x: 2800, y: 320, width: 200, height: 60 },
    { x: 2850, y: 260, width: 100, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 150, y: 550, radius: 12 },
    { x: 300, y: 550, radius: 12 },
    { x: 450, y: 550, radius: 12 },
    { x: 600, y: 550, radius: 12 },
    { x: 750, y: 550, radius: 12 },
    { x: 900, y: 550, radius: 12 },
    { x: 1050, y: 550, radius: 12 },
    { x: 1200, y: 550, radius: 12 },
    { x: 1350, y: 550, radius: 12 },
    { x: 1500, y: 550, radius: 12 },
    { x: 1650, y: 550, radius: 12 },
    { x: 1800, y: 550, radius: 12 },
    { x: 1950, y: 550, radius: 12 },

    // Сложный путь (17 монет)
    { x: 150, y: 450, radius: 12 },
    { x: 250, y: 390, radius: 12 },
    { x: 350, y: 330, radius: 12 },
    { x: 450, y: 270, radius: 12 },
    { x: 550, y: 210, radius: 12 },
    { x: 650, y: 150, radius: 12 },
    { x: 750, y: 210, radius: 12 },
    { x: 850, y: 270, radius: 12 },
    { x: 950, y: 210, radius: 12 },
    { x: 1050, y: 150, radius: 12 },
    { x: 1150, y: 210, radius: 12 },
    { x: 1250, y: 270, radius: 12 },
    { x: 1350, y: 210, radius: 12 },
    { x: 1450, y: 150, radius: 12 },
    { x: 1550, y: 210, radius: 12 },
    { x: 1650, y: 270, radius: 12 },
    { x: 1750, y: 210, radius: 12 },
  ],
  obstacles: [
    // Простой путь
    { x: 200, y: 580, width: 50, height: 30 },
    { x: 500, y: 580, width: 50, height: 30 },
    { x: 800, y: 580, width: 50, height: 30 },
    { x: 1100, y: 580, width: 50, height: 30 },
    { x: 1400, y: 580, width: 50, height: 30 },
    { x: 1700, y: 580, width: 50, height: 30 },
    { x: 2000, y: 580, width: 50, height: 30 },
    { x: 2300, y: 580, width: 50, height: 30 },
    { x: 2600, y: 580, width: 50, height: 30 },

    // Сложный путь
    { x: 180, y: 480, width: 40, height: 30 },
    { x: 280, y: 420, width: 40, height: 30 },
    { x: 380, y: 360, width: 40, height: 30 },
    { x: 480, y: 300, width: 40, height: 30 },
    { x: 580, y: 240, width: 40, height: 30 },
    { x: 680, y: 180, width: 40, height: 30 },
    { x: 780, y: 240, width: 40, height: 30 },
    { x: 880, y: 300, width: 40, height: 30 },
    { x: 980, y: 240, width: 40, height: 30 },
    { x: 1080, y: 180, width: 40, height: 30 },
    { x: 1180, y: 240, width: 40, height: 30 },
    { x: 1280, y: 300, width: 40, height: 30 },
    { x: 1380, y: 240, width: 40, height: 30 },
    { x: 1480, y: 180, width: 40, height: 30 },
    { x: 1580, y: 240, width: 40, height: 30 },
    { x: 1680, y: 300, width: 40, height: 30 },
    { x: 1780, y: 240, width: 40, height: 30 },
    { x: 1880, y: 180, width: 40, height: 30 },
    { x: 1980, y: 240, width: 40, height: 30 },
    { x: 2080, y: 300, width: 40, height: 30 },
    { x: 2180, y: 240, width: 40, height: 30 },
    { x: 2280, y: 180, width: 40, height: 30 },
    { x: 2380, y: 240, width: 40, height: 30 },
    { x: 2480, y: 300, width: 40, height: 30 },
    { x: 2580, y: 240, width: 40, height: 30 },
  ],
  finish: { x: 2875, y: 210, width: 50, height: 50 },
  breakableRoof: { x: 2800, y: 250, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#7f1d1d",
})

// Ледяной мир
levelRegistry.register({
  id: "ice1",
  name: "Ледяные пещеры",
  difficulty: 2,
  width: 2200,
  height: 500,
  playerStart: { x: 50, y: 350 },
  platforms: [
    { x: 0, y: 460, width: 2200, height: 40 },
    // Простой путь
    { x: 150, y: 380, width: 120, height: 20 },
    { x: 320, y: 380, width: 120, height: 20 },
    { x: 490, y: 380, width: 120, height: 20 },
    { x: 660, y: 380, width: 120, height: 20 },
    { x: 830, y: 380, width: 120, height: 20 },
    { x: 1000, y: 380, width: 120, height: 20 },
    { x: 1170, y: 380, width: 120, height: 20 },
    { x: 1340, y: 380, width: 120, height: 20 },
    { x: 1510, y: 380, width: 120, height: 20 },
    { x: 1680, y: 380, width: 120, height: 20 },
    { x: 1850, y: 380, width: 120, height: 20 },

    // Сложный путь
    { x: 200, y: 280, width: 80, height: 20 },
    { x: 320, y: 220, width: 80, height: 20 },
    { x: 440, y: 160, width: 80, height: 20 },
    { x: 560, y: 220, width: 80, height: 20 },
    { x: 680, y: 280, width: 80, height: 20 },
    { x: 800, y: 220, width: 80, height: 20 },
    { x: 920, y: 160, width: 80, height: 20 },
    { x: 1040, y: 220, width: 80, height: 20 },
    { x: 1160, y: 280, width: 80, height: 20 },
    { x: 1280, y: 220, width: 80, height: 20 },
    { x: 1400, y: 160, width: 80, height: 20 },
    { x: 1520, y: 220, width: 80, height: 20 },
    { x: 1640, y: 280, width: 80, height: 20 },
    { x: 1760, y: 220, width: 80, height: 20 },
    { x: 1880, y: 160, width: 80, height: 20 },

    // Соединение
    { x: 1970, y: 300, width: 100, height: 20 },

    // Финишная постройка
    { x: 2050, y: 240, width: 150, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 210, y: 350, radius: 20 },
    { x: 380, y: 350, radius: 20 },
    { x: 550, y: 350, radius: 20 },
    { x: 720, y: 350, radius: 20 },
    { x: 890, y: 350, radius: 20 },
    { x: 1060, y: 350, radius: 20 },
    { x: 1230, y: 350, radius: 20 },
    { x: 1400, y: 350, radius: 20 },
    { x: 1570, y: 350, radius: 20 },
    { x: 1740, y: 350, radius: 20 },
    { x: 1910, y: 350, radius: 20 },
    { x: 2020, y: 270, radius: 20 },
    { x: 2150, y: 210, radius: 20 },

    // Сложный путь (17 монет)
    { x: 240, y: 250, radius: 20 },
    { x: 360, y: 190, radius: 20 },
    { x: 480, y: 130, radius: 20 },
    { x: 600, y: 190, radius: 20 },
    { x: 720, y: 250, radius: 20 },
    { x: 840, y: 190, radius: 20 },
    { x: 960, y: 130, radius: 20 },
    { x: 1080, y: 190, radius: 20 },
    { x: 1200, y: 250, radius: 20 },
    { x: 1320, y: 190, radius: 20 },
    { x: 1440, y: 130, radius: 20 },
    { x: 1560, y: 190, radius: 20 },
    { x: 1680, y: 250, radius: 20 },
    { x: 1800, y: 190, radius: 20 },
    { x: 1920, y: 130, radius: 20 },
    { x: 2020, y: 270, radius: 20 },
    { x: 2120, y: 210, radius: 20 },
  ],
  obstacles: [
    // Простой путь
    { x: 270, y: 380, width: 50, height: 25 },
    { x: 610, y: 380, width: 50, height: 25 },
    { x: 950, y: 380, width: 50, height: 25 },
    { x: 1290, y: 380, width: 50, height: 25 },
    { x: 1630, y: 380, width: 50, height: 25 },

    // Сложный путь
    { x: 280, y: 280, width: 40, height: 20 },
    { x: 400, y: 220, width: 40, height: 20 },
    { x: 520, y: 160, width: 40, height: 20 },
    { x: 640, y: 220, width: 40, height: 20 },
    { x: 760, y: 280, width: 40, height: 20 },
    { x: 880, y: 220, width: 40, height: 20 },
    { x: 1000, y: 160, width: 40, height: 20 },
    { x: 1120, y: 220, width: 40, height: 20 },
    { x: 1240, y: 280, width: 40, height: 20 },
    { x: 1360, y: 220, width: 40, height: 20 },
    { x: 1480, y: 160, width: 40, height: 20 },
    { x: 1600, y: 220, width: 40, height: 20 },
    { x: 1720, y: 280, width: 40, height: 20 },
    { x: 1840, y: 220, width: 40, height: 20 },
  ],
  finish: { x: 2100, y: 190, width: 50, height: 50 },
  backgroundColor: "#1e3a8a",
})

levelRegistry.register({
  id: "ice2",
  name: "Замерзшие высоты",
  difficulty: 3,
  width: 2800,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 2800, height: 40 },
    // Простой путь
    { x: 100, y: 480, width: 100, height: 20 },
    { x: 250, y: 480, width: 100, height: 20 },
    { x: 400, y: 480, width: 100, height: 20 },
    { x: 550, y: 480, width: 100, height: 20 },
    { x: 700, y: 480, width: 100, height: 20 },
    { x: 850, y: 480, width: 100, height: 20 },
    { x: 1000, y: 480, width: 100, height: 20 },
    { x: 1150, y: 480, width: 100, height: 20 },
    { x: 1300, y: 480, width: 100, height: 20 },
    { x: 1450, y: 480, width: 100, height: 20 },
    { x: 1600, y: 480, width: 100, height: 20 },
    { x: 1750, y: 480, width: 100, height: 20 },
    { x: 1900, y: 480, width: 100, height: 20 },
    { x: 2050, y: 480, width: 100, height: 20 },
    { x: 2200, y: 480, width: 100, height: 20 },
    { x: 2350, y: 480, width: 100, height: 20 },
    { x: 2500, y: 480, width: 100, height: 20 },

    // Сложный путь
    { x: 120, y: 380, width: 60, height: 15 },
    { x: 220, y: 320, width: 60, height: 15 },
    { x: 320, y: 260, width: 60, height: 15 },
    { x: 420, y: 200, width: 60, height: 15 },
    { x: 520, y: 140, width: 60, height: 15 },
    { x: 620, y: 200, width: 60, height: 15 },
    { x: 720, y: 260, width: 60, height: 15 },
    { x: 820, y: 200, width: 60, height: 15 },
    { x: 920, y: 140, width: 60, height: 15 },
    { x: 1020, y: 200, width: 60, height: 15 },
    { x: 1120, y: 260, width: 60, height: 15 },
    { x: 1220, y: 200, width: 60, height: 15 },
    { x: 1320, y: 140, width: 60, height: 15 },
    { x: 1420, y: 200, width: 60, height: 15 },
    { x: 1520, y: 260, width: 60, height: 15 },
    { x: 1620, y: 200, width: 60, height: 15 },
    { x: 1720, y: 140, width: 60, height: 15 },
    { x: 1820, y: 200, width: 60, height: 15 },
    { x: 1920, y: 260, width: 60, height: 15 },
    { x: 2020, y: 200, width: 60, height: 15 },
    { x: 2120, y: 140, width: 60, height: 15 },
    { x: 2220, y: 200, width: 60, height: 15 },
    { x: 2320, y: 260, width: 60, height: 15 },
    { x: 2420, y: 200, width: 60, height: 15 },
    { x: 2520, y: 140, width: 60, height: 15 },

    // Соединение
    { x: 2600, y: 380, width: 100, height: 20 },

    // Финишная постройка с ломающейся крышей
    { x: 2650, y: 220, width: 200, height: 60 },
    { x: 2700, y: 160, width: 100, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 150, y: 450, radius: 15 },
    { x: 300, y: 450, radius: 15 },
    { x: 450, y: 450, radius: 15 },
    { x: 600, y: 450, radius: 15 },
    { x: 750, y: 450, radius: 15 },
    { x: 900, y: 450, radius: 15 },
    { x: 1050, y: 450, radius: 15 },
    { x: 1200, y: 450, radius: 15 },
    { x: 1350, y: 450, radius: 15 },
    { x: 1500, y: 450, radius: 15 },
    { x: 1650, y: 450, radius: 15 },
    { x: 1800, y: 450, radius: 15 },
    { x: 1950, y: 450, radius: 15 },

    // Сложный путь (17 монет)
    { x: 150, y: 350, radius: 15 },
    { x: 250, y: 290, radius: 15 },
    { x: 350, y: 230, radius: 15 },
    { x: 450, y: 170, radius: 15 },
    { x: 550, y: 110, radius: 15 },
    { x: 650, y: 170, radius: 15 },
    { x: 750, y: 230, radius: 15 },
    { x: 850, y: 170, radius: 15 },
    { x: 950, y: 110, radius: 15 },
    { x: 1050, y: 170, radius: 15 },
    { x: 1150, y: 230, radius: 15 },
    { x: 1250, y: 170, radius: 15 },
    { x: 1350, y: 110, radius: 15 },
    { x: 1450, y: 170, radius: 15 },
    { x: 1550, y: 230, radius: 15 },
    { x: 1650, y: 170, radius: 15 },
    { x: 1750, y: 110, radius: 15 },
  ],
  obstacles: [
    // Простой путь
    { x: 200, y: 480, width: 50, height: 20 },
    { x: 500, y: 480, width: 50, height: 20 },
    { x: 800, y: 480, width: 50, height: 20 },
    { x: 1100, y: 480, width: 50, height: 20 },
    { x: 1400, y: 480, width: 50, height: 20 },
    { x: 1700, y: 480, width: 50, height: 20 },
    { x: 2000, y: 480, width: 50, height: 20 },
    { x: 2300, y: 480, width: 50, height: 20 },

    // Сложный путь
    { x: 180, y: 380, width: 40, height: 20 },
    { x: 280, y: 320, width: 40, height: 20 },
    { x: 380, y: 260, width: 40, height: 20 },
    { x: 480, y: 200, width: 40, height: 20 },
    { x: 580, y: 140, width: 40, height: 20 },
    { x: 680, y: 200, width: 40, height: 20 },
    { x: 780, y: 260, width: 40, height: 20 },
    { x: 880, y: 200, width: 40, height: 20 },
    { x: 980, y: 140, width: 40, height: 20 },
    { x: 1080, y: 200, width: 40, height: 20 },
    { x: 1180, y: 260, width: 40, height: 20 },
    { x: 1280, y: 200, width: 40, height: 20 },
    { x: 1380, y: 140, width: 40, height: 20 },
    { x: 1480, y: 200, width: 40, height: 20 },
    { x: 1580, y: 260, width: 40, height: 20 },
    { x: 1680, y: 200, width: 40, height: 20 },
    { x: 1780, y: 140, width: 40, height: 20 },
    { x: 1880, y: 200, width: 40, height: 20 },
    { x: 1980, y: 260, width: 40, height: 20 },
    { x: 2080, y: 200, width: 40, height: 20 },
    { x: 2180, y: 140, width: 40, height: 20 },
    { x: 2280, y: 200, width: 40, height: 20 },
    { x: 2380, y: 260, width: 40, height: 20 },
    { x: 2480, y: 200, width: 40, height: 20 },
  ],
  finish: { x: 2725, y: 110, width: 50, height: 50 },
  breakableRoof: { x: 2650, y: 150, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#1e40af",
})

// Космос
levelRegistry.register({
  id: "space1",
  name: "Космическая станция",
  difficulty: 3,
  width: 2600,
  height: 600,
  playerStart: { x: 50, y: 450 },
  platforms: [
    { x: 0, y: 560, width: 2600, height: 40 },
    // Простой путь
    { x: 120, y: 480, width: 100, height: 20 },
    { x: 270, y: 480, width: 100, height: 20 },
    { x: 420, y: 480, width: 100, height: 20 },
    { x: 570, y: 480, width: 100, height: 20 },
    { x: 720, y: 480, width: 100, height: 20 },
    { x: 870, y: 480, width: 100, height: 20 },
    { x: 1020, y: 480, width: 100, height: 20 },
    { x: 1170, y: 480, width: 100, height: 20 },
    { x: 1320, y: 480, width: 100, height: 20 },
    { x: 1470, y: 480, width: 100, height: 20 },
    { x: 1620, y: 480, width: 100, height: 20 },
    { x: 1770, y: 480, width: 100, height: 20 },
    { x: 1920, y: 480, width: 100, height: 20 },
    { x: 2070, y: 480, width: 100, height: 20 },
    { x: 2220, y: 480, width: 100, height: 20 },

    // Сложный путь
    { x: 150, y: 380, width: 80, height: 20 },
    { x: 280, y: 320, width: 80, height: 20 },
    { x: 420, y: 260, width: 80, height: 20 },
    { x: 560, y: 200, width: 80, height: 20 },
    { x: 700, y: 140, width: 80, height: 20 },
    { x: 840, y: 200, width: 80, height: 20 },
    { x: 980, y: 260, width: 80, height: 20 },
    { x: 1120, y: 200, width: 80, height: 20 },
    { x: 1260, y: 140, width: 80, height: 20 },
    { x: 1400, y: 200, width: 80, height: 20 },
    { x: 1540, y: 260, width: 80, height: 20 },
    { x: 1680, y: 200, width: 80, height: 20 },
    { x: 1820, y: 140, width: 80, height: 20 },
    { x: 1960, y: 200, width: 80, height: 20 },
    { x: 2100, y: 260, width: 80, height: 20 },
    { x: 2240, y: 200, width: 80, height: 20 },

    // Соединение
    { x: 2320, y: 380, width: 100, height: 20 },

    // Финишная постройка с ломающейся крышей
    { x: 2400, y: 220, width: 200, height: 60 },
    { x: 2450, y: 160, width: 100, height: 60 },
  ],
  coins: [
    // Простой путь (13 монет)
    { x: 170, y: 450, radius: 18 },
    { x: 320, y: 450, radius: 18 },
    { x: 470, y: 450, radius: 18 },
    { x: 620, y: 450, radius: 18 },
    { x: 770, y: 450, radius: 18 },
    { x: 920, y: 450, radius: 18 },
    { x: 1070, y: 450, radius: 18 },
    { x: 1220, y: 450, radius: 18 },
    { x: 1370, y: 450, radius: 18 },
    { x: 1520, y: 450, radius: 18 },
    { x: 1670, y: 450, radius: 18 },
    { x: 1820, y: 450, radius: 18 },
    { x: 1970, y: 450, radius: 18 },

    // Сложный путь (17 монет)
    { x: 190, y: 350, radius: 18 },
    { x: 320, y: 290, radius: 18 },
    { x: 460, y: 230, radius: 18 },
    { x: 600, y: 170, radius: 18 },
    { x: 740, y: 110, radius: 18 },
    { x: 880, y: 170, radius: 18 },
    { x: 1020, y: 230, radius: 18 },
    { x: 1160, y: 170, radius: 18 },
    { x: 1300, y: 110, radius: 18 },
    { x: 1440, y: 170, radius: 18 },
    { x: 1580, y: 230, radius: 18 },
    { x: 1720, y: 170, radius: 18 },
    { x: 1860, y: 110, radius: 18 },
    { x: 2000, y: 170, radius: 18 },
    { x: 2140, y: 230, radius: 18 },
    { x: 2280, y: 170, radius: 18 },
    { x: 2370, y: 350, radius: 18 },
  ],
  obstacles: [
    // Простой путь
    { x: 220, y: 480, width: 50, height: 25 },
    { x: 520, y: 480, width: 50, height: 25 },
    { x: 820, y: 480, width: 50, height: 25 },
    { x: 1120, y: 480, width: 50, height: 25 },
    { x: 1420, y: 480, width: 50, height: 25 },
    { x: 1720, y: 480, width: 50, height: 25 },
    { x: 2020, y: 480, width: 50, height: 25 },

    // Сложный путь
    { x: 230, y: 380, width: 50, height: 25 },
    { x: 360, y: 320, width: 50, height: 25 },
    { x: 500, y: 260, width: 50, height: 25 },
    { x: 640, y: 200, width: 50, height: 25 },
    { x: 780, y: 140, width: 50, height: 25 },
    { x: 920, y: 200, width: 50, height: 25 },
    { x: 1060, y: 260, width: 50, height: 25 },
    { x: 1200, y: 200, width: 50, height: 25 },
    { x: 1340, y: 140, width: 50, height: 25 },
    { x: 1480, y: 200, width: 50, height: 25 },
    { x: 1620, y: 260, width: 50, height: 25 },
    { x: 1760, y: 200, width: 50, height: 25 },
    { x: 1900, y: 140, width: 50, height: 25 },
    { x: 2040, y: 200, width: 50, height: 25 },
    { x: 2180, y: 260, width: 50, height: 25 },
  ],
  finish: { x: 2475, y: 110, width: 50, height: 50 },
  breakableRoof: { x: 2400, y: 150, width: 200, height: 10 }, // Ломающаяся крыша
  backgroundColor: "#1e1b4b",
})