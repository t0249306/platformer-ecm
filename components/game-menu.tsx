"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface GameMenuProps {
  onLevelSelect: () => void
  onComingSoon: () => void
  onBack: () => void
}

export default function GameMenu({ onLevelSelect, onComingSoon, onBack }: GameMenuProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-center">Меню игры</h2>
          <div className="flex flex-col gap-4 w-full">
            <Button size="lg" onClick={onLevelSelect} className="w-full">
              🎮 Выбрать уровень
            </Button>
            <Button size="lg" variant="outline" onClick={onComingSoon} className="w-full">
              🚀 Coming Soon
            </Button>
          </div>
          <Button variant="outline" onClick={onBack} className="w-full">
            ← Назад
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}