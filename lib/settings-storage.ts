export interface GameSettings {
  soundEnabled: boolean
  soundVolume: number
  controlMode: "two-handed" | "one-handed"
  fullscreenEnabled: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  controlMode: "two-handed",
  fullscreenEnabled: false,
}

const STORAGE_KEY = "platformer-game-settings"

export class SettingsStorage {
  static save(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  static load(): GameSettings {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS // Ensure this code only runs in the browser
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
    return DEFAULT_SETTINGS
  }

  static reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to reset settings:", error)
    }
  }
}