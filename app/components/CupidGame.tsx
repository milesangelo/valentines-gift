"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import styles from "./CupidGame.module.css"

interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  cupidSize: number
  heartWidth: number
  heartGap: number
  gravity: number
  jumpStrength: number
  heartSpeed: number
}

const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 400,
  canvasHeight: 700,
  cupidSize: 30,
  heartWidth: 40,
  heartGap: 200,
  gravity: 0.5,
  jumpStrength: 8,
  heartSpeed: 2,
}

interface Heart {
  x: number
  topHeight: number
}

interface CupidGameProps {
  config?: Partial<GameConfig>
}

export default function CupidGame({ config = {} }: CupidGameProps) {
  const gameConfig: GameConfig = { ...DEFAULT_CONFIG, ...config }
  const { canvasWidth, canvasHeight, cupidSize, heartWidth, heartGap, gravity, jumpStrength, heartSpeed } =
    gameConfig

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState(0)

  const cupidRef = useRef({ y: canvasHeight / 2, velocity: 0 })
  const heartsRef = useRef<Heart[]>([])
  const animationFrameRef = useRef(0)
  const gameActiveRef = useRef(false)

  const jump = useCallback(() => {
    if (gameActiveRef.current) {
      cupidRef.current.velocity = -jumpStrength
    }
  }, [jumpStrength])

  const resetGame = useCallback(() => {
    cupidRef.current = { y: canvasHeight / 2, velocity: 0 }
    heartsRef.current = []
    setGameOver(false)
    setScore(0)
    gameActiveRef.current = false
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount > 1) return prevCount - 1
        clearInterval(countdownInterval)
        gameActiveRef.current = true
        if (canvasRef.current) {
          startGameLoop(canvasRef.current)
        }
        return 0
      })
    }, 1000)
  }, [canvasHeight])

  const startGameLoop = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const gameLoop = () => {
        if (!gameActiveRef.current) return

        // Update cupid position
        cupidRef.current.velocity += gravity
        cupidRef.current.y += cupidRef.current.velocity

        // Move hearts
        heartsRef.current.forEach((heart) => {
          heart.x -= heartSpeed
        })

        // Remove off-screen hearts
        heartsRef.current = heartsRef.current.filter((heart) => heart.x > -heartWidth)

        // Add new hearts
        if (
          heartsRef.current.length === 0 ||
          heartsRef.current[heartsRef.current.length - 1].x < canvas.width - heartGap
        ) {
          heartsRef.current.push({
            x: canvas.width,
            topHeight: Math.random() * (canvas.height - heartGap - 100) + 50,
          })
        }

        // Check for collisions
        const cupidHitbox = {
          x: 50,
          y: cupidRef.current.y,
          width: cupidSize,
          height: cupidSize,
        }

        for (const heart of heartsRef.current) {
          const topHeartHitbox = {
            x: heart.x,
            y: 0,
            width: heartWidth,
            height: heart.topHeight,
          }
          const bottomHeartHitbox = {
            x: heart.x,
            y: heart.topHeight + heartGap,
            width: heartWidth,
            height: canvas.height - heart.topHeight - heartGap,
          }

          if (
            isCollision(cupidHitbox, topHeartHitbox) ||
            isCollision(cupidHitbox, bottomHeartHitbox) ||
            cupidRef.current.y < 0 ||
            cupidRef.current.y > canvas.height - cupidSize
          ) {
            gameActiveRef.current = false
            setGameOver(true)
            return
          }
        }

        // Increase score
        setScore((prevScore) => prevScore + 1)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw cupid
        ctx.fillStyle = "pink"
        ctx.fillRect(50, cupidRef.current.y, cupidSize, cupidSize)

        // Draw hearts
        ctx.fillStyle = "red"
        heartsRef.current.forEach((heart) => {
          drawHeart(ctx, heart.x, 0, heartWidth, heart.topHeight)
          drawHeart(ctx, heart.x, heart.topHeight + heartGap, heartWidth, canvas.height - heart.topHeight - heartGap)
        })

        // Continue game loop
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }

      gameLoop()
    },
    [gravity, heartGap, heartSpeed, heartWidth, cupidSize],
  )

  const isCollision = (rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save()
    ctx.translate(x + width / 2, y + height / 2)
    const scale = Math.min(width, height) / 100
    ctx.scale(scale, scale)
    ctx.beginPath()
    ctx.moveTo(0, 30)
    ctx.bezierCurveTo(-40, -30, -80, 20, 0, 80)
    ctx.bezierCurveTo(80, 20, 40, -30, 0, 30)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.restore()
  }

  useEffect(() => {
    resetGame()

    return () => {
      gameActiveRef.current = false
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [resetGame])

  return (
    <div className={styles.gameContainer} style={{ width: canvasWidth, height: canvasHeight }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} onClick={jump} className={styles.gameCanvas} />
      {countdown > 0 && <div className={styles.countdown}>{countdown}</div>}
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Over</h2>
          <p>Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

