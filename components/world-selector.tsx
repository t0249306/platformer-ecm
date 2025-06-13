"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { levelRegistry } from "@/lib/game/level-registry"
import { StatisticsStorage } from "@/lib/statistics-storage"

interface WorldSelectorProps {
  onWorldSelect: (worldId: string) => void
  onBack: () => void
}

export default function WorldSelector({ onWorldSelect, onBack }: WorldSelectorProps) {
  const worlds = levelRegistry.getAllWorlds()

  const getWorldProgress = (worldId: string) => {
    const levels = levelRegistry.getLevelsByWorld(worldId)
    const completedLevels = levels.filter((level) => {
      const stats = StatisticsStorage.getLevelStatistics(level.id)
      return stats && stats.completions > 0
    })
    return {
      completed: completedLevels.length,
      total: levels.length,
      percentage: levels.length > 0 ? Math.round((completedLevels.length / levels.length) * 100) : 0,
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Выбор мира</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-3 sm:gap-4 mb-6">
          {worlds.map((world) => {
            const progress = getWorldProgress(world.id)
            const isUnlocked =
              world.id === "normal" ||
              progress.completed > 0 ||
              (world.id === "hell" && getWorldProgress("normal").completed >= 2) ||
              (world.id === "ice" && getWorldProgress("hell").completed >= 1) ||
              (world.id === "space" && getWorldProgress("ice").completed >= 1)

            return (
              <Card
                key={world.id}
                className={`transition-all hover:shadow-md ${!isUnlocked ? "opacity-60" : "cursor-pointer"}`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className="text-3xl sm:text-4xl p-2 sm:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${world.color}20` }}
                      >
                        {world.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base sm:text-lg truncate" style={{ color: world.color }}>
                            {world.name}
                          </h3>
                          {progress.completed === progress.total && progress.total > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                              ✅ Завершен
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                          {world.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                          <span>Уровней: {progress.total}</span>
                          <span className="text-green-600">
                            Пройдено: {progress.completed}/{progress.total} ({progress.percentage}%)
                          </span>
                        </div>
                        {!isUnlocked && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {world.id === "hell" && "Пройдите 2 уровня в Обычном мире"}
                            {world.id === "ice" && "Пройдите 1 уровень в Адских землях"}
                            {world.id === "space" && "Пройдите 1 уровень в Ледяном мире"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => onWorldSelect(world.id)}
                        disabled={!isUnlocked}
                        size="sm"
                        style={{
                          backgroundColor: isUnlocked ? world.color : undefined,
                          borderColor: world.color,
                        }}
                        className={`${isUnlocked ? "text-white hover:opacity-90" : ""} text-xs sm:text-sm px-3 sm:px-4`}
                      >
                        {isUnlocked ? "Войти" : "🔒 Заблокирован"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={onBack}>
            ← Назад
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}