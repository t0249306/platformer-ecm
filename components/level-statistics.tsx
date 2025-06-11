"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { levelRegistry } from "@/lib/game/level-registry"
import { StatisticsStorage } from "@/lib/statistics-storage"
import { Trophy, Clock, Coins, Target, Calendar, RotateCcw } from "lucide-react"

interface LevelStatisticsProps {
  levelId: string
  onBack: () => void
}

export default function LevelStatisticsComponent({ levelId, onBack }: LevelStatisticsProps) {
  const level = levelRegistry.get(levelId)
  const stats = StatisticsStorage.getLevelStatistics(levelId)

  if (!level) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Уровень не найден</p>
            <Button onClick={onBack} className="mt-4">
              ← Назад
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds)
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const ms = totalMs % 1000

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  }

  const getDifficultyStars = (difficulty: 1 | 2 | 3) => {
    return "⭐".repeat(difficulty)
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

  const getCompletionRate = () => {
    if (!stats || stats.totalAttempts === 0) return 0
    return Math.round((stats.completions / stats.totalAttempts) * 100)
  }

  const getCoinsPercentage = () => {
    if (!stats || stats.bestCoins === 0) return 0
    return Math.round((stats.bestCoins / level.coins.length) * 100)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{level.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium ${getDifficultyColor(level.difficulty)}`}>
                Сложность: {getDifficultyStars(level.difficulty)}
              </span>
            </div>
          </div>
          {stats && stats.completions > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Пройден
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!stats || stats.completions === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Уровень не пройден</h3>
            <p className="text-muted-foreground mb-4">Пройдите уровень, чтобы увидеть статистику</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Лучшее время</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {stats.bestTime ? formatTime(stats.bestTime) : "—"}
                  </div>
                  {stats.bestTime && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats.bestTime < 15000
                        ? "🏆 Невероятно!"
                        : stats.bestTime < 30000
                          ? "⭐ Отлично!"
                          : stats.bestTime < 60000
                            ? "👍 Хорошо!"
                            : "🎯 Неплохо!"}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Лучший результат</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.bestCoins}/{level.coins.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{getCoinsPercentage()}% монет собрано</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Процент прохождения</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{getCompletionRate()}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.completions} из {stats.totalAttempts} попыток
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Последняя игра</span>
                  </div>
                  <div className="text-sm font-medium text-purple-600">
                    {stats.lastPlayedAt.toLocaleDateString("ru-RU")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.lastPlayedAt.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Общая статистика
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Всего попыток:</span>
                  <div className="font-medium">{stats.totalAttempts}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Успешных прохождений:</span>
                  <div className="font-medium">{stats.completions}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button onClick={onBack} className="w-full">
            ← Назад к выбору уровня
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}