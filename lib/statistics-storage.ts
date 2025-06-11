import { log } from "console"

export interface LevelStatistics {
  levelId: string
  bestTime: number | null
  bestCoins: number
  totalAttempts: number
  completions: number
  lastPlayedAt: Date
}

export interface GameStatistics {
  levels: Map<string, LevelStatistics>
  totalPlayTime: number
  totalCoins: number
}

const STATISTICS_KEY = "platformer-game-statistics"

export class StatisticsStorage {
  static save(statistics: GameStatistics): void {
    try {
      const serializable = {
        levels: Array.from(statistics.levels.entries()).map(([key, value]) => [
          key,
          {
            ...value,
            lastPlayedAt: value.lastPlayedAt.toISOString(),
          },
        ]),
        totalPlayTime: statistics.totalPlayTime,
        totalCoins: statistics.totalCoins,
      }
      localStorage.setItem(STATISTICS_KEY, JSON.stringify(serializable))
    } catch (error) {
      console.error("Failed to save statistics:", error)
    }
  }

  static load(): GameStatistics {
    if (typeof window === "undefined") {
      return {
        levels: new Map(),
        totalPlayTime: 0,
        totalCoins: 0,
      }
    }

    try {
      const stored = localStorage.getItem(STATISTICS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const levels: Map<string, LevelStatistics> = new Map(
          parsed.levels.map(([key, value]: [string, any]) => [
            key,
            {
              ...value,
              lastPlayedAt: new Date(value.lastPlayedAt),
            },
          ]),
        )
        return {
          levels,
          totalPlayTime: parsed.totalPlayTime || 0,
          totalCoins: parsed.totalCoins || 0,
        }
      }
    } catch (error) {
      console.error("Failed to load statistics:", error)
    }

    return {
      levels: new Map(),
      totalPlayTime: 0,
      totalCoins: 0,
    }
  }

  static updateLevelStatistics(
    levelId: string,
    completionTime: number | null,
    coinsCollected: number,
    totalCoins: number,
    completed: boolean,
  ): void {
    console.log(`Updating statistics for level ${levelId}: completed=${completed}, time=${completionTime}, coins=${coinsCollected}/${totalCoins}`);
    
    const stats = this.load()
    const existing = stats.levels.get(levelId) || {
      levelId,
      bestTime: null,
      bestCoins: 0,
      totalAttempts: 0,
      completions: 0,
      lastPlayedAt: new Date(),
    }

    existing.totalAttempts++
    existing.lastPlayedAt = new Date()

    if (completed) {
      existing.completions++
      stats.totalCoins += coinsCollected

      if (completionTime !== null) {
        const shouldUpdateBestTime =
          existing.bestTime === null ||
          (coinsCollected >= existing.bestCoins && completionTime < existing.bestTime) ||
          coinsCollected > existing.bestCoins

        if (shouldUpdateBestTime) {
          existing.bestTime = completionTime
          existing.bestCoins = coinsCollected
        }
      }

      if (completionTime !== null) {
        stats.totalPlayTime += completionTime
      }
    }

    stats.levels.set(levelId, existing)
    this.save(stats)
  }

  static getLevelStatistics(levelId: string): LevelStatistics | null {
    const stats = this.load()
    return stats.levels.get(levelId) || null
  }

  static reset(): void {
    try {
      localStorage.removeItem(STATISTICS_KEY)
    } catch (error) {
      console.error("Failed to reset statistics:", error)
    }
  }
}