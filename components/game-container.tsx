"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGame } from "@/hooks/use-game"
import { useMobile } from "@/hooks/use-mobile"
import MobileControls from "./mobile-controls"

export default function GameContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const gameStartDateRef = useRef<Date | null>(null)
  const gameEndDateRef = useRef<Date | null>(null)
  const timeUpdateFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const isMobile = useMobile()

  const [controlMode, setControlMode] = useState<"two-handed" | "one-handed">("two-handed")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { initGame, resetGame, handleMobileControl, resetKeys } = useRef(
    useGame({
      canvasRef,
      onScoreUpdate: (newScore: number) => setScore(newScore),
      onGameOver: () => {
        if (isMobile) {
          resetKeys()
        }
        stopTimer()
        setGameOver(true)
      },
      onGameWon: () => {
        if (isMobile) {
          resetKeys()
        }
        stopTimer()
        setGameWon(true)
      },
    }),
  ).current

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
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (gameStarted) {
      // Блокируем скролл страницы
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      // Предотвращаем touch события для скролла
      const preventScroll = (e: TouchEvent) => {
        e.preventDefault()
      }

      const preventWheel = (e: WheelEvent) => {
        e.preventDefault()
      }

      document.addEventListener("touchmove", preventScroll, { passive: false })
      document.addEventListener("wheel", preventWheel, { passive: false })

      return () => {
        // Восстанавливаем скролл при размонтировании
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
        document.removeEventListener("touchmove", preventScroll)
        document.removeEventListener("wheel", preventWheel)
      }
    }
  }, [gameStarted])

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      initGame()
      startTimer()
    }
  }, [gameStarted, initGame])

  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      timeUpdateFrameRef.current = requestAnimationFrame(updateTime)
    }

    return () => {
      if (timeUpdateFrameRef.current) {
        cancelAnimationFrame(timeUpdateFrameRef.current)
      }
    }
  }, [gameStarted, gameOver, gameWon, updateTime])

  useEffect(() => {
    return () => {
      if (timeUpdateFrameRef.current) {
        cancelAnimationFrame(timeUpdateFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      // Очистка при размонтировании компонента
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [])

  const handleStartGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setGameWon(false)
    setScore(0)
    setCurrentTime(0)
    setFinalTime(0)
  }

  const handleRestartGame = () => {
    if (timeUpdateFrameRef.current) {
      cancelAnimationFrame(timeUpdateFrameRef.current)
    }

    resetGame()
    setGameOver(false)
    setGameWon(false)
    setScore(0)
    setCurrentTime(0)
    setFinalTime(0)

    setTimeout(() => {
      startTimer()
    }, 150)
  }

  const handleControlModeChange = () => {
    setControlMode(controlMode === "two-handed" ? "one-handed" : "two-handed")
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Основная карточка игры */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="text-xl font-bold">Счёт: {score}</div>
              {gameStarted && !gameOver && !gameWon && (
                <div className="text-xl font-bold text-blue-600 font-mono">Время: {formatTime(currentTime)}</div>
              )}
            </div>
            <div className="flex gap-2">
              {gameStarted && !gameOver && !gameWon && (
                <Button variant="outline" onClick={handleRestartGame}>
                  Начать заново
                </Button>
              )}
              {!isMobile && (
                <Button variant="outline" onClick={toggleFullscreen}>
                  {isFullscreen ? "🔲 Выход" : "⛶ Полный экран"}
                </Button>
              )}
            </div>
          </div>

          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-6">
              <h2 className="text-2xl font-bold">Добро пожаловать в Платформер!</h2>
              <p className="text-center text-muted-foreground">
                Используйте стрелки влево/вправо или клавиши A/D для движения и пробел или стрелку вверх/W для прыжка.
                Соберите все монеты и доберитесь до финиша как можно быстрее!
              </p>
              <Button size="lg" onClick={handleStartGame}>
                Начать игру
              </Button>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="border border-slate-600 rounded-md bg-slate-800 w-full h-auto"
              />

              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md z-30">
                  <h2 className="text-3xl font-bold text-red-500 mb-4">Игра окончена!</h2>
                  <div className="text-white mb-2">Ваш счёт: {score}</div>
                  <div className="text-white mb-4 font-mono text-lg">Время: {formatTime(finalTime)}</div>
                  <Button size="lg" onClick={handleRestartGame}>
                    Попробовать снова
                  </Button>
                </div>
              )}

              {gameWon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md z-30">
                  <h2 className="text-3xl font-bold text-green-500 mb-4">Победа!</h2>
                  <div className="text-white mb-2">Ваш счёт: {score}</div>
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
                  <Button size="lg" onClick={handleRestartGame}>
                    Играть снова
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Управление:</p>
            <ul className="list-disc list-inside">
              <li>A/D - движение</li>
              <li>Пробел или W - прыжок</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Мобильные элементы управления */}
      {isMobile && gameStarted && !gameOver && !gameWon && (
        <MobileControls
          controlMode={controlMode}
          isFullscreen={isFullscreen}
          onMobileControl={handleMobileControl}
          onControlModeChange={handleControlModeChange}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  )
}
