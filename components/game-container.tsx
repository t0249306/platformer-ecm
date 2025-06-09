"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGame } from "@/hooks/use-game"
import { useMobile } from "@/hooks/use-mobile"

export default function GameContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const isMobile = useRef(useMobile()).current

  const { initGame, resetGame, handleMobileControl, resetKeys } = useRef(
    useGame({
      canvasRef,
      onScoreUpdate: (newScore: number) => setScore(newScore),
      onGameOver: () => {
        if (isMobile) {
          resetKeys()
        }
        setGameOver(true)
      },
      onGameWon: () => {
        if (isMobile) {
          resetKeys()
        }
        setGameWon(true)
      },
    })
  ).current

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      initGame()
    }
  }, [gameStarted, initGame])

  const handleStartGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setGameWon(false)
    setScore(0)
  }

  const handleRestartGame = () => {
    resetGame()
    setGameOver(false)
    setGameWon(false)
    setScore(0)
  }

  return (
    <div className="w-full max-w-3xl">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">Счёт: {score}</div>
            {gameStarted && !gameOver && !gameWon && (
              <Button variant="outline" onClick={handleRestartGame}>
                Начать заново
              </Button>
            )}
          </div>

          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-6">
              <h2 className="text-2xl font-bold">Добро пожаловать в Платформер!</h2>
              <p className="text-center text-muted-foreground">
                Используйте стрелки влево/вправо или клавиши A/D для движения и пробел или стрелку вверх/W для прыжка.
                Соберите все монеты и доберитесь до финиша!
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md">
                  <h2 className="text-3xl font-bold text-red-500 mb-4">Игра окончена!</h2>
                  <p className="text-white mb-6">Ваш счёт: {score}</p>
                  <Button size="lg" onClick={handleRestartGame}>
                    Попробовать снова
                  </Button>
                </div>
              )}

              {gameWon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-md">
                  <h2 className="text-3xl font-bold text-green-500 mb-4">Победа!</h2>
                  <p className="text-white mb-6">Ваш счёт: {score}</p>
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
              <li>Стрелки влево/вправо или A/D - движение</li>
              <li>Пробел или стрелка вверх/W - прыжок</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {isMobile && gameStarted && !gameOver && !gameWon && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-8">
            <div className="flex gap-3">
              <button
                className="w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-2xl font-bold rounded-xl shadow-lg border-2 border-blue-400 transition-all duration-75 active:scale-95 select-none"
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleMobileControl("left", true)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleMobileControl("left", false)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleMobileControl("left", true)
                }}
                onMouseUp={(e) => {
                  e.preventDefault()
                  handleMobileControl("left", false)
                }}
                onMouseLeave={(e) => {
                  e.preventDefault()
                  handleMobileControl("left", false)
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                ←
              </button>
              <button
                className="w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-2xl font-bold rounded-xl shadow-lg border-2 border-blue-400 transition-all duration-75 active:scale-95 select-none"
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleMobileControl("right", true)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleMobileControl("right", false)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleMobileControl("right", true)
                }}
                onMouseUp={(e) => {
                  e.preventDefault()
                  handleMobileControl("right", false)
                }}
                onMouseLeave={(e) => {
                  e.preventDefault()
                  handleMobileControl("right", false)
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                →
              </button>
            </div>
            <button
              className="w-20 h-20 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white text-xl font-bold rounded-full shadow-lg border-2 border-green-400 transition-all duration-75 active:scale-95 select-none"
              onTouchStart={(e) => {
                e.preventDefault()
                handleMobileControl("jump", true)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleMobileControl("jump", false)
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                handleMobileControl("jump", true)
              }}
              onMouseUp={(e) => {
                e.preventDefault()
                handleMobileControl("jump", false)
              }}
              onMouseLeave={(e) => {
                e.preventDefault()
                handleMobileControl("jump", false)
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              _
            </button>
          </div>
        </div>
      )}
    </div>
  )
}