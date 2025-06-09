"use client"

import type React from "react"

import { useCallback, useEffect, useRef } from "react"
import { Player } from "@/lib/game/player"
import { Platform } from "@/lib/game/platform"
import { Coin } from "@/lib/game/coin"
import { Finish } from "@/lib/game/finish"
import { Obstacle } from "@/lib/game/obstacle"

interface GameProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onScoreUpdate: (score: number) => void
  onGameOver: () => void
  onGameWon: () => void
}

export function useGame({ canvasRef, onScoreUpdate, onGameOver, onGameWon }: GameProps) {
  const playerRef = useRef<Player | null>(null)
  const platformsRef = useRef<Platform[]>([])
  const coinsRef = useRef<Coin[]>([])
  const obstaclesRef = useRef<Obstacle[]>([])
  const finishRef = useRef<Finish | null>(null)
  const animationFrameRef = useRef<number>(0)
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const gameActiveRef = useRef<boolean>(false)
  const scoreRef = useRef<number>(0)
  const totalCoinsRef = useRef<number>(0)
  const gameInitializedRef = useRef<boolean>(false)
  const lastTimeRef = useRef<number>(0)

  const createLevel = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height

    playerRef.current = new Player(50, canvasHeight - 150, 40, 60)

    platformsRef.current = [
      new Platform(0, canvasHeight - 40, canvasWidth, 40),
      new Platform(200, canvasHeight - 120, 150, 20),
      new Platform(400, canvasHeight - 180, 150, 20),
      new Platform(600, canvasHeight - 240, 150, 20),
      new Platform(200, canvasHeight - 300, 150, 20),
      new Platform(50, canvasHeight - 380, 100, 20),
      new Platform(400, canvasHeight - 380, 350, 20),
      new Platform(50, canvasHeight - 210, 100, 20),
    ]

    coinsRef.current = [
      new Coin(250, canvasHeight - 150, 20),
      new Coin(450, canvasHeight - 210, 20),
      new Coin(650, canvasHeight - 270, 20),
      new Coin(250, canvasHeight - 330, 20),
      new Coin(100, canvasHeight - 410, 20),
      new Coin(500, canvasHeight - 410, 20),
      new Coin(600, canvasHeight - 410, 20),
    ]
    totalCoinsRef.current = coinsRef.current.length

    obstaclesRef.current = [
      new Obstacle(350, canvasHeight - 180, 50, 20),
      new Obstacle(550, canvasHeight - 240, 50, 20),
      new Obstacle(300, canvasHeight - 300, 50, 20),
    ]

    finishRef.current = new Finish(700, canvasHeight - 430, 50, 50)
  }, [])

  const update = useCallback(
    (currentTime: number) => {
      if (!canvasRef.current || !gameActiveRef.current) return

      const deltaTime = currentTime - lastTimeRef.current
      if (deltaTime < 9) {
        animationFrameRef.current = requestAnimationFrame(update)
        return
      }
      lastTimeRef.current = currentTime

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const player = playerRef.current
      const platforms = platformsRef.current
      const coins = coinsRef.current
      const obstacles = obstaclesRef.current
      const finish = finishRef.current

      if (!player || !finish) return

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      if (keysRef.current["ArrowLeft"]) {
        player.moveLeft()
      }
      if (keysRef.current["ArrowRight"]) {
        player.moveRight()
      }
      if ((keysRef.current[" "] || keysRef.current["ArrowUp"]) && player.canJump) {
        player.jump()
      }

      player.update(ctx.canvas.width)
      player.applyGravity()

      player.canJump = false
      for (const platform of platforms) {
        if (player.checkPlatformCollision(platform)) {
          player.canJump = true
        }
      }

      if (player.y > ctx.canvas.height) {
        gameActiveRef.current = false
        onGameOver()
        return
      }

      for (const obstacle of obstacles) {
        if (player.checkObstacleCollision(obstacle)) {
          gameActiveRef.current = false
          onGameOver()
          return
        }
      }

      let coinCollected = false
      for (let i = coins.length - 1; i >= 0; i--) {
        if (player.checkCoinCollision(coins[i])) {
          coinCollected = true
          coins.splice(i, 1)
          scoreRef.current += 10
          break
        }
      }

      if (player.checkFinishCollision(finish)) {
        if (coins.length === 0) {
          scoreRef.current += 50
        }
        gameActiveRef.current = false
        onGameWon()
        return
      }

      ctx.fillStyle = "#1e293b"
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      for (const platform of platforms) {
        platform.draw(ctx)
      }

      for (const coin of coins) {
        coin.draw(ctx)
      }

      for (const obstacle of obstacles) {
        obstacle.draw(ctx)
      }

      finish.draw(ctx)
      player.draw(ctx)

      if (coinCollected) {
        onScoreUpdate(scoreRef.current)
      }

      if (gameActiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(update)
      }
    },
    [onGameOver, onGameWon, onScoreUpdate],
  )

  const initGame = useCallback(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (!gameInitializedRef.current) {
      scoreRef.current = 0
      gameInitializedRef.current = true
    }

    gameActiveRef.current = false
    createLevel(ctx)
    gameActiveRef.current = true
    lastTimeRef.current = performance.now()
    animationFrameRef.current = requestAnimationFrame(update)

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true

      if (e.code === "KeyW") keysRef.current["ArrowUp"] = true
      if (e.code === "KeyA") keysRef.current["ArrowLeft"] = true
      if (e.code === "KeyS") keysRef.current["ArrowDown"] = true
      if (e.code === "KeyD") keysRef.current["ArrowRight"] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false

      if (e.code === "KeyW") keysRef.current["ArrowUp"] = false
      if (e.code === "KeyA") keysRef.current["ArrowLeft"] = false
      if (e.code === "KeyS") keysRef.current["ArrowDown"] = false
      if (e.code === "KeyD") keysRef.current["ArrowRight"] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationFrameRef.current)
      gameActiveRef.current = false
    }
  }, [createLevel, update])

  const resetGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    gameActiveRef.current = false
    scoreRef.current = 0
    gameInitializedRef.current = false

    setTimeout(() => {
      initGame()
    }, 100)
  }, [initGame])

  const handleMobileControl = useCallback((action: "left" | "right" | "jump", isPressed: boolean) => {
    console.log(`Mobile control: ${action} ${isPressed ? "pressed" : "released"}`);
    
    if (action === "left") {
      keysRef.current["ArrowLeft"] = isPressed
    } else if (action === "right") {
      keysRef.current["ArrowRight"] = isPressed
    } else if (action === "jump") {
      keysRef.current["ArrowUp"] = isPressed
    }
  }, [])

  const resetKeys = useCallback(() => {
    keysRef.current = {}
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      gameActiveRef.current = false
    }
  }, [])

  return { initGame, resetGame, handleMobileControl, resetKeys }
}