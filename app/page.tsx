"use client"

import { useState, useEffect } from "react"
import CupidGame from "./components/CupidGame"
import styles from "./page.module.css"

const discussionQuestions = [
  {
    question: "What's your favorite memory of us together and why?",
    backgroundImage: "/images/quiz-bg-1.jpg",
  },
  {
    question: "If you could plan our perfect date, what would it look like?",
    backgroundImage: "/images/quiz-bg-2.jpg",
  },
  {
    question: "What's one thing you'd like us to achieve together in the next year?",
    backgroundImage: "/images/quiz-bg-3.jpg",
  },
]

export default function ValentinesExperience() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [discussionCompleted, setDiscussionCompleted] = useState(false)
  const [gameConfig, setGameConfig] = useState({
    canvasWidth: 400,
    canvasHeight: 600,
    cupidSize: 50,
  })

  useEffect(() => {
    const updateGameSize = () => {
      const containerWidth = Math.min(400, window.innerWidth - 40)
      const containerHeight = Math.min(600, window.innerHeight - 200)
      setGameConfig({
        canvasWidth: containerWidth,
        canvasHeight: containerHeight,
        cupidSize: Math.max(40, Math.floor(containerWidth * 0.125)),
      })
    }

    updateGameSize()
    window.addEventListener("resize", updateGameSize)
    return () => window.removeEventListener("resize", updateGameSize)
  }, [])

  const handleNextQuestion = () => {
    if (currentQuestion < discussionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setDiscussionCompleted(true)
    }
  }

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(${discussionQuestions[currentQuestion].backgroundImage})`,
      }}
    >
      {!discussionCompleted ? (
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Question for Discussion</h2>
            <p className={styles.cardQuestion}>{discussionQuestions[currentQuestion].question}</p>
            <button onClick={handleNextQuestion} className={styles.nextButton}>
              {currentQuestion < discussionQuestions.length - 1 ? "Next Question" : "Finish & Play Game"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.gameContainer}>
          <h2 className={styles.gameTitle}>Let's Play a Game!</h2>
          <p className={styles.gameInstructions}>Help Cupid avoid the hearts.</p>
          <CupidGame config={gameConfig} />
        </div>
      )}
    </main>
  )
}

