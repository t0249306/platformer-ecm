"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { type ActiveGameStatistics, useGame } from "@/hooks/use-game"
import { useMobile } from "@/hooks/use-mobile"
import { levelRegistry } from "@/lib/game/level-registry"
import { SettingsStorage, type GameSettings } from "@/lib/settings-storage"
import { StatisticsStorage } from "@/lib/statistics-storage"
import { soundManager } from "@/lib/sound-manager"
import { ArrowLeft, RotateCcw } from "lucide-react"
import MobileControls from "@/components/mobile-controls"
import GameMenu from "@/components/game-menu"
import LevelSelector from "@/components/level-selector"
import LevelStatisticsComponent from "@/components/level-statistics"
import ComingSoon from "@/components/coming-soon"
import Settings from "@/components/settings"
import FullscreenNotification from "@/components/fullscreen-notification"

type GameState = "welcome" | "settings" | "menu" | "level-select" | "level-statistics" | "coming-soon" | "playing"

export default function GameContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>("welcome")
  const [previousState, setPreviousState] = useState<GameState>("welcome")
  const [currentLevelId, setCurrentLevelId] = useState<string>("")
  const [selectedLevelForStats, setSelectedLevelForStats] = useState<string>("")
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const [score, setScore] = useState(0)
  const [coinsCollected, setCoinsCollected] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)

  const gameStartDateRef = useRef<Date | null>(null)
  const gameEndDateRef = useRef<Date | null>(null)
  const timeUpdateFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const isMobile = useRef(useMobile()).current

  const [settings, setSettings] = useState<GameSettings>(() => SettingsStorage.load())
  const [isFullscreen, setIsFullscreen] = useState(settings.fullscreenEnabled)
  const [showFullscreenNotification, setShowFullscreenNotification] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const { initGame, resetGame, handleMobileControl, resetKeys } = useRef(
    useGame({
      canvasRef,
      onScoreUpdate: (newScore: number, newCoinsCollected: number) => {
        setScore(newScore)
        setCoinsCollected(newCoinsCollected)
      },
      onGameOver: (stats: ActiveGameStatistics) => {
        if (isMobile) {
          resetKeys()
        }
        stopTimer()
        setGameOver(true)

        StatisticsStorage.updateLevelStatistics(stats.levelId, null, stats.coinsCollected, stats.totalCoins, false)
      },
      onGameWon: (stats: ActiveGameStatistics) => {
        if (isMobile) {
          resetKeys()
        }
        stopTimer()
        setGameWon(true)

        const currentLevel = stats.level
        if (currentLevel) {
          StatisticsStorage.updateLevelStatistics(
            stats.levelId,
            stats.endTime!.getTime() - stats.startTime.getTime(),
            stats.coinsCollected,
            stats.totalCoins,
            true,
          )
        }
      },
    }),
  ).current

  const getCurrentLevel = () => levelRegistry.get(currentLevelId)

  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled)
    soundManager.setVolume(settings.soundVolume)
  }, [settings.soundEnabled, settings.soundVolume])

  useEffect(() => {
    if (settings.fullscreenEnabled && !hasInteracted) {
      setShowFullscreenNotification(true)
    }
  }, [settings.fullscreenEnabled, hasInteracted])

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    SettingsStorage.save(updatedSettings)
  }

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds)
    const minutes = Math.floor(totalMs / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const ms = totalMs % 1000

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  }

  const updateTime = useCallback(
    (currentTime: number) => {
      if (gameStartDateRef.current && !gameOver && !gameWon) {
        const deltaTime = currentTime - lastTimeRef.current
        if (deltaTime < 9) {
          timeUpdateFrameRef.current = requestAnimationFrame(updateTime)
          return
        }
        lastTimeRef.current = currentTime

        const now = new Date()
        const elapsed = now.getTime() - gameStartDateRef.current.getTime()
        setCurrentTime(elapsed)
        timeUpdateFrameRef.current = requestAnimationFrame(updateTime)
      }
    },
    [gameOver, gameWon],
  )

  const startTimer = () => {
    gameStartDateRef.current = new Date()
    gameEndDateRef.current = null
    setCurrentTime(0)
    setFinalTime(0)

    timeUpdateFrameRef.current = requestAnimationFrame(updateTime)
  }

  const stopTimer = () => {
    if (timeUpdateFrameRef.current) {
      cancelAnimationFrame(timeUpdateFrameRef.current)
      timeUpdateFrameRef.current = 0
    }

    if (gameStartDateRef.current) {
      gameEndDateRef.current = new Date()
      const elapsed = gameEndDateRef.current.getTime() - gameStartDateRef.current.getTime()
      setFinalTime(elapsed)
      setCurrentTime(elapsed)
    }
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        updateSettings({ fullscreenEnabled: true })
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
        updateSettings({ fullscreenEnabled: false })
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)
      updateSettings({ fullscreenEnabled: isCurrentlyFullscreen })
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true)
      setShowFullscreenNotification(false)

      if (settings.fullscreenEnabled && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          updateSettings({ fullscreenEnabled: false })
          setIsFullscreen(false)
        })
      }

      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [settings.fullscreenEnabled])

  useEffect(() => {
    if (gameState === "playing") {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
      document.body.style.userSelect = "none"
      document.documentElement.style.userSelect = "none"

      const preventScroll = (e: TouchEvent) => {
        e.preventDefault()
      }

      const preventWheel = (e: WheelEvent) => {
        e.preventDefault()
      }

      document.addEventListener("touchmove", preventScroll, { passive: false })
      document.addEventListener("wheel", preventWheel, { passive: false })

      return () => {
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
        document.body.style.userSelect = ""
        document.documentElement.style.userSelect = ""
        document.removeEventListener("touchmove", preventScroll)
        document.removeEventListener("wheel", preventWheel)
      }
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === "playing" && canvasRef.current) {
      initGame(currentLevelId)
      startTimer()
    }
  }, [gameState, initGame, currentLevelId])

  useEffect(() => {
    if (gameState === "playing" && !gameOver && !gameWon) {
      timeUpdateFrameRef.current = requestAnimationFrame(updateTime)
    }

    return () => {
      if (timeUpdateFrameRef.current) {
        cancelAnimationFrame(timeUpdateFrameRef.current)
      }
    }
  }, [gameState, gameOver, gameWon, updateTime])

  useEffect(() => {
    return () => {
      if (timeUpdateFrameRef.current) {
        cancelAnimationFrame(timeUpdateFrameRef.current)
      }
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.userSelect = ""
      document.documentElement.style.userSelect = ""
    }
  }, [])

  const navigateToState = (newState: GameState) => {
    setPreviousState(gameState)
    setGameState(newState)
  }

  const handleStartGame = () => {
    navigateToState("menu")
  }

  const handleSettings = () => {
    navigateToState("settings")
  }

  const handleLevelSelect = (levelId: string) => {
    setCurrentLevelId(levelId)
    setPreviousState("level-select")
    setGameState("playing")
    setGameOver(false)
    setGameWon(false)
    setScore(0)
    setCoinsCollected(0)
    setCurrentTime(0)
    setFinalTime(0)
  }

  const handleLevelStatistics = (levelId: string) => {
    setSelectedLevelForStats(levelId)
    navigateToState("level-statistics")
  }

  const handleRestartGame = () => {
    if (timeUpdateFrameRef.current) {
      cancelAnimationFrame(timeUpdateFrameRef.current)
    }

    resetGame(currentLevelId)
    setGameOver(false)
    setGameWon(false)
    setScore(0)
    setCoinsCollected(0)
    setCurrentTime(0)
    setFinalTime(0)

    setTimeout(() => {
      startTimer()
    }, 150)
  }

  const handleBackToPrevious = () => {
    if (timeUpdateFrameRef.current) {
      cancelAnimationFrame(timeUpdateFrameRef.current)
    }

    resetGame(currentLevelId)
    setGameState(previousState)
    setGameOver(false)
    setGameWon(false)
    setScore(0)
    setCoinsCollected(0)
    setCurrentTime(0)
    setFinalTime(0)
  }

  const handleControlModeChange = () => {
    const newMode = settings.controlMode === "two-handed" ? "one-handed" : "two-handed"
    updateSettings({ controlMode: newMode })
  }

  const handleSoundEnabledChange = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled })
  }

  const handleSoundVolumeChange = (volume: number) => {
    updateSettings({ soundVolume: volume })
  }

  const handleDismissFullscreenNotification = () => {
    setShowFullscreenNotification(false)
  }

  const getDifficultyStars = (difficulty: 1 | 2 | 3) => {
    return "⭐".repeat(difficulty)
  }

  if (gameState === "welcome") {
    return (
      <>
        <div className="w-full max-w-3xl mx-auto">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center p-10 space-y-6">
                <h2 className="text-2xl font-bold">Добро пожаловать в Платформер!</h2>
                <p className="text-center text-muted-foreground">
                  Используйте A/D для движения и пробел/W для прыжка. Соберите все монеты и доберитесь до финиша как
                  можно быстрее!
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Button size="lg" onClick={handleStartGame} className="w-full">
                    🎮 Играть
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleSettings} className="w-full">
                    ⚙️ Настройки
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <FullscreenNotification show={showFullscreenNotification} onDismiss={handleDismissFullscreenNotification} />
      </>
    )
  }

  if (gameState === "settings") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Settings
          controlMode={settings.controlMode}
          isFullscreen={isFullscreen}
          soundEnabled={settings.soundEnabled}
          soundVolume={settings.soundVolume}
          onControlModeChange={handleControlModeChange}
          onToggleFullscreen={toggleFullscreen}
          onSoundEnabledChange={handleSoundEnabledChange}
          onSoundVolumeChange={handleSoundVolumeChange}
          onBack={() => setGameState("welcome")}
        />
      </div>
    )
  }

  if (gameState === "menu") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <GameMenu
          onLevelSelect={() => navigateToState("level-select")}
          onComingSoon={() => navigateToState("coming-soon")}
          onBack={() => setGameState("welcome")}
        />
      </div>
    )
  }

  if (gameState === "level-select") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <LevelSelector
          onLevelSelect={handleLevelSelect}
          onLevelStatistics={handleLevelStatistics}
          onBack={() => setGameState("menu")}
        />
      </div>
    )
  }

  if (gameState === "level-statistics") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <LevelStatisticsComponent levelId={selectedLevelForStats} onBack={() => setGameState("level-select")} />
      </div>
    )
  }

  if (gameState === "coming-soon") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ComingSoon onBack={() => setGameState("menu")} />
      </div>
    )
  }

  const currentLevel = getCurrentLevel()

  return (
    <div className="w-full max-w-3xl mx-auto select-none">
      <Card className="w-full">
        <CardContent className="p-6">
          {!gameOver && !gameWon && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6 items-center">
                <div className="text-xl font-bold text-yellow-600">
                  Монеты: {coinsCollected}/{currentLevel?.coins.length || 0}
                </div>
                {currentLevel && !isMobile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Сложность:</span>
                    <span className="text-lg">{getDifficultyStars(currentLevel.difficulty)}</span>
                  </div>
                )}
                {gameState === "playing" && !gameOver && !gameWon && (
                  <div className="text-xl font-bold text-blue-600 font-mono">Время: {formatTime(currentTime)}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToPrevious}
                  className="h-8 w-8 p-0"
                  title="Назад"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {gameState === "playing" && !gameOver && !gameWon && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRestartGame}
                    className="h-8 w-8 p-0"
                    title="Начать заново"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={isMobile && (gameWon || gameOver) ? 650 : currentLevel?.height || 500}
              className="border border-slate-600 rounded-md bg-slate-800 w-full h-auto select-none"
            />

            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md z-30">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Игра окончена!</h2>
                <div className="text-white mb-2">Ваш счёт: {score}</div>
                <div className="text-white mb-2">
                  Собрано монет: {coinsCollected}/{currentLevel?.coins.length || 0}
                </div>
                <div className="text-white mb-4 font-mono text-lg">Время: {formatTime(finalTime)}</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="lg" onClick={handleRestartGame}>
                    Попробовать снова
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleBackToPrevious}>
                    Назад
                  </Button>
                </div>
              </div>
            )}

            {gameWon && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md z-30">
                <h2 className="text-3xl font-bold text-green-500 mb-4">Победа!</h2>
                <div className="text-white mb-2">Ваш счёт: {score}</div>
                <div className="text-white mb-2">
                  Собрано монет: {coinsCollected}/{currentLevel?.coins.length || 0}
                </div>
                <div className="text-white mb-2 font-mono text-lg">Время прохождения: {formatTime(finalTime)}</div>
                <div className="text-yellow-400 mb-4 text-sm">
                  {finalTime < 15000
                    ? "🏆 Невероятно быстро!"
                    : finalTime < 30000
                      ? "⭐ Отличное время!"
                      : finalTime < 60000
                        ? "👍 Хорошее время!"
                        : "🎯 Неплохо!"}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="lg" onClick={handleRestartGame}>
                    Играть снова
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleBackToPrevious}>
                    Назад
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Управление:</p>
            <ul className="list-disc list-inside">
              <li>A/D - движение</li>
              <li>Пробел или W - прыжок</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {isMobile && gameState === "playing" && !gameOver && !gameWon && (
        <MobileControls controlMode={settings.controlMode} onMobileControl={handleMobileControl} />
      )}
    </div>
  )
}