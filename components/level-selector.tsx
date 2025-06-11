"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { levelRegistry } from "@/lib/game/level-registry"

interface LevelSelectorProps {
  onLevelSelect: (levelId: string) => void
  onBack: () => void
}

export default function LevelSelector({ onLevelSelect, onBack }: LevelSelectorProps) {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Выбор уровня</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 mb-6">
          {levels.map((level) => (
            <Card key={level.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{level.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${getDifficultyColor(level.difficulty)}`}>
                        Сложность: {getDifficultyStars(level.difficulty)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Размер: {level.width}x{level.height} | Монет: {level.coins.length} | Препятствий:{" "}
                      {level.obstacles.length}
                    </p>
                  </div>
                  <Button onClick={() => onLevelSelect(level.id)} className="ml-4">
                    Играть
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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