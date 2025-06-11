"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useMobile } from "@/hooks/use-mobile"
import { soundManager } from "@/lib/sound-manager"
import { useEffect, useState } from "react"

interface SettingsProps {
  controlMode: "two-handed" | "one-handed"
  isFullscreen: boolean
  soundEnabled: boolean
  soundVolume: number
  onControlModeChange: () => void
  onToggleFullscreen: () => void
  onSoundEnabledChange: (enabled: boolean) => void
  onSoundVolumeChange: (volume: number) => void
  onBack: () => void
}

export default function Settings({
  controlMode,
  isFullscreen,
  soundEnabled,
  soundVolume,
  onControlModeChange,
  onToggleFullscreen,
  onSoundEnabledChange,
  onSoundVolumeChange,
  onBack,
}: SettingsProps) {
  const isMobile = useMobile()
  const [volumeValue, setVolumeValue] = useState([soundVolume * 100])

  useEffect(() => {
    soundManager.setMuted(!soundEnabled)
    soundManager.setVolume(soundVolume)
  }, [soundEnabled, soundVolume])

  useEffect(() => {
    setVolumeValue([soundVolume * 100])
  }, [soundVolume])

  const handleSoundToggle = (checked: boolean) => {
    onSoundEnabledChange(checked)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolumeValue(value)
    onSoundVolumeChange(newVolume)
  }

  const testSound = () => {
    soundManager.play("coin")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Настройки</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Управление</h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Клавиатура (ПК)</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• A/D или ←/→ - движение</div>
                <div>• Пробел или W/↑ - прыжок</div>
              </div>
            </div>

            {isMobile && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Мобильное управление</Label>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm">Режим управления</div>
                    <div className="text-xs text-muted-foreground">
                      {controlMode === "two-handed" ? "🤲 Две руки" : "👆 Одна рука"}
                    </div>
                  </div>
                  <Switch checked={controlMode === "one-handed"} onCheckedChange={onControlModeChange} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Экран</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Полноэкранный режим</Label>
                <div className="text-xs text-muted-foreground">{isFullscreen ? "Включен" : "Выключен"}</div>
              </div>
              <Switch checked={isFullscreen} onCheckedChange={onToggleFullscreen} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Звук</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Звуковые эффекты</Label>
                <div className="text-xs text-muted-foreground">{soundEnabled ? "Включены" : "Выключены"}</div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
            </div>

            {soundEnabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Громкость</Label>
                  <span className="text-xs text-muted-foreground">{Math.round(volumeValue[0])}%</span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={volumeValue}
                    onValueChange={handleVolumeChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-center">
                    <Button size="sm" variant="outline" onClick={testSound} className="text-xs">
                      🔊 Тест звука
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Игровой процесс</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Соберите все монеты для максимального счета</div>
              <div>• Избегайте красных препятствий</div>
              <div>• Доберитесь до зеленого флага для победы</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={onBack} className="w-full">
            ← Назад
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}