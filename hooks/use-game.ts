"use client"

import type React from "react"

import { useCallback, useEffect, useRef } from "react"
import { Player } from "@/lib/game/player"
import { Level } from "@/lib/game/level"
import { Camera } from "@/lib/game/camera"
import { levelRegistry } from "@/lib/game/level-registry"
import { soundManager } from "@/lib/sound-manager"

export interface ActiveGameStatistics {
  levelId: string
  level: Level
  coinsCollected: number
  totalCoins: number
  startTime: Date
  endTime?: Date
}

interface GameProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onCoinCollect: (level: Level, coinsCollected: number) => void
  onGameOver: (stats: ActiveGameStatistics) => void
  onGameWon: (stats: ActiveGameStatistics) => void
}

export function useGame({ canvasRef, onCoinCollect, onGameOver, onGameWon }: GameProps) {
  const playerRef = useRef<Player | null>(null)
  const levelRef = useRef<Level | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const animationFrameRef = useRef<number>(0)
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const gameActiveRef = useRef<boolean>(false)
  const coinsCollectedRef = useRef<number>(0)
  const totalCoinsRef = useRef<number>(0)
  const gameInitializedRef = useRef<boolean>(false)
  const lastTimeRef = useRef<number>(0)

  const startGameTimeRef = useRef<Date | null>(null)
  const endGameTimeRef = useRef<Date | null>(null)

  const createLevel = useCallback((ctx: CanvasRenderingContext2D, levelId: string) => {
    const levelData = levelRegistry.get(levelId)
    if (!levelData) {
      console.error(`Level ${levelId} not found`)
      return
    }

    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height

    levelRef.current = new Level(levelData)

    cameraRef.current = new Camera(canvasWidth, canvasHeight, levelData.width, levelData.height)

    playerRef.current = new Player(levelData.playerStart.x, levelData.playerStart.y, 40, 60)

    totalCoinsRef.current = levelRef.current.getTotalCoins()
    coinsCollectedRef.current = 0
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
      const level = levelRef.current
      const camera = cameraRef.current

      if (!player || !level || !camera) return

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      if (keysRef.current["ArrowLeft"]) {
        player.moveLeft()
      }
      if (keysRef.current["ArrowRight"]) {
        player.moveRight()
      }
      if ((keysRef.current[" "] || keysRef.current["ArrowUp"]) && player.canJump) {
        soundManager.play("jump")
        player.jump()
      }

      player.update(level.width)
      player.applyGravity()

      player.canJump = false
      for (const platform of level.platforms) {
        if (player.checkPlatformCollision(platform)) {
          player.canJump = true
        }
      }

      if (player.canJump && player.checkHeadCollision(level.platforms, level.obstacles)) {
        player.canJump = false
      }

      // Проверяем, стоит ли игрок на крыше финишного куба
      level.checkPlayerOnRoof(player.x, player.y, player.width, player.height)

      // Обновляем уровень (для анимации ломающейся крыши)
      level.update()

      if (player.y > level.height) {
        gameActiveRef.current = false
        endGameTimeRef.current = new Date()
        soundManager.play("death")
        onGameOver({
          levelId: level.id,
          level: level,
          coinsCollected: coinsCollectedRef.current,
          totalCoins: totalCoinsRef.current,
          startTime: startGameTimeRef.current!,
          endTime: endGameTimeRef.current,
        })
        return
      }

      for (const obstacle of level.obstacles) {
        if (player.checkObstacleCollision(obstacle)) {
          gameActiveRef.current = false
          endGameTimeRef.current = new Date()
          soundManager.play("death")
          onGameOver({
            levelId: level.id,
            level: level,
            coinsCollected: coinsCollectedRef.current,
            totalCoins: totalCoinsRef.current,
            startTime: startGameTimeRef.current!,
            endTime: endGameTimeRef.current,
          })
          return
        }
      }

      let coinCollected = false
      for (let i = level.coins.length - 1; i >= 0; i--) {
        if (player.checkCoinCollision(level.coins[i])) {
          coinCollected = true
          level.removeCoin(i)
          coinsCollectedRef.current += 1
          soundManager.play("coin")
          break
        }
      }

      if (player.checkFinishCollision(level.finish)) {
        gameActiveRef.current = false
        endGameTimeRef.current = new Date()
        soundManager.play("win")
        onGameWon({
          levelId: level.id,
          level: level,
          coinsCollected: coinsCollectedRef.current,
          totalCoins: totalCoinsRef.current,
          startTime: startGameTimeRef.current!,
          endTime: endGameTimeRef.current,
        })
        return
      }

      camera.follow(player.x + player.width / 2, player.y + player.height / 2)

      level.draw(ctx, camera)

      const playerScreenPos = camera.worldToScreen(player.x, player.y)
      player.drawAt(ctx, playerScreenPos.x, playerScreenPos.y)

      if (coinCollected) {
        onCoinCollect(level, coinsCollectedRef.current)
      }

      if (gameActiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(update)
      }
    },
    [onGameOver, onGameWon, onCoinCollect],
  )

  const initGame = useCallback(
    (currentLevelId: string) => {
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (!gameInitializedRef.current) {
        coinsCollectedRef.current = 0
        gameInitializedRef.current = true
      }

      gameActiveRef.current = false
      createLevel(ctx, currentLevelId)
      startGameTimeRef.current = new Date()
      endGameTimeRef.current = null
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
    },
    [createLevel, update],
  )

  const resetGame = useCallback(
    (currentLevelId: string) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      gameActiveRef.current = false
      startGameTimeRef.current = new Date()
      endGameTimeRef.current = null
      coinsCollectedRef.current = 0
      gameInitializedRef.current = false

      setTimeout(() => {
        initGame(currentLevelId)
      }, 100)
    },
    [initGame],
  )

  const handleMobileControl = useCallback((action: "left" | "right" | "jump", isPressed: boolean) => {
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