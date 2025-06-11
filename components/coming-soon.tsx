"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ComingSoonProps {
  onBack: () => void
}

export default function ComingSoon({ onBack }: ComingSoonProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl">🚀</div>
          <h2 className="text-2xl font-bold text-center">Coming Soon</h2>
          <p className="text-center text-muted-foreground">
            Скоро здесь появятся новые функции! Следите за обновлениями. Возможно:
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div>• Таблица рекордов</div>
            <div>• Другое</div>
          </div>
          <Button onClick={onBack} className="w-full">
            ← Назад
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}