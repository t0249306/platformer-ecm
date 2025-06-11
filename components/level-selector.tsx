"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { levelRegistry } from "@/lib/game/level-registry"
import { StatisticsStorage } from "@/lib/statistics-storage"
import { BarChart3, Trophy } from "lucide-react"

interface LevelSelectorProps {
  onLevelSelect: (levelId: string) => void
  onLevelStatistics: (levelId: string) => void
  onBack: () => void
}

export default function LevelSelector({ onLevelSelect, onLevelStatistics, onBack }: LevelSelectorProps) {
  const levels = levelRegistry.getAll()

  const getDifficultyStars = (difficulty: 1 | 2 | 3) => {
    return "⭐".repeat(difficulty) + "☆".repeat(3 - difficulty)
  }

  const getDifficultyColor = (difficulty: 1 | 2 | 3) => {
    switch (difficulty) {
      case 1:
        return "text-green-600"
      case 2:
        return "text-yellow-600"
      case 3:
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds)
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const ms = totalMs % 1000

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Выбор уровня</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 mb-6">
          {levels.map((level) => {
            const stats = StatisticsStorage.getLevelStatistics(level.id)
            const isCompleted = stats && stats.completions > 0
            const hasStats = stats && stats.totalAttempts > 0

            return (
              <Card key={level.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{level.name}</h3>
                        {isCompleted && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Пройден
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${getDifficultyColor(level.difficulty)}`}>
                          Сложность: {getDifficultyStars(level.difficulty)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          Размер: {level.width}x{level.height} | Монет: {level.coins.length} | Препятствий:{" "}
                          {level.obstacles.length}
                        </div>
                        {isCompleted && stats.bestTime && (
                          <div className="flex items-center gap-4">
                            <span className="text-blue-600 font-medium">
                              🏆 Лучшее время: {formatTime(stats.bestTime)}
                            </span>
                            <span className="text-yellow-600 font-medium">
                              🪙 Монет: {stats.bestCoins}/{level.coins.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button onClick={() => onLevelSelect(level.id)}>Играть</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLevelStatistics(level.id)}
                        disabled={!hasStats}
                        className={`flex items-center gap-1 ${!hasStats ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <BarChart3 className="h-3 w-3" />
                        Статистика
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