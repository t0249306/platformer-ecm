"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FullscreenNotificationProps {
  show: boolean
  onDismiss: () => void
}

export default function FullscreenNotification({ show, onDismiss }: FullscreenNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🖥️</div>
              <h3 className="text-lg font-semibold">Полноэкранный режим</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>У вас включен полноэкранный режим в настройках.</p>
            <p>
              <strong className="text-foreground">
                Полноэкранный режим активируется после любого нажатия на экран.
              </strong>
            </p>
            <p>Это необходимо из-за политики безопасности браузера.</p>
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={handleDismiss} className="flex-1">
              Понятно
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}