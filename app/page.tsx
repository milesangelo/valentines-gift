"use client"

import { useState } from "react"
import Question from "./components/Question"
import HeartAnimation from "./components/HeartAnimation"
import CupidGame from "./components/CupidGame"
import styles from "./page.module.css"

const questions = [
  {
    question: "Where did we have our first date?",
    options: ["Park", "Restaurant", "Movies", "Beach"],
    correctAnswer: "Restaurant",
    backgroundImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    question: "What's my favorite flower?",
    options: ["Rose", "Tulip", "Sunflower", "Lily"],
    correctAnswer: "Sunflower",
    backgroundImage: "/placeholder.svg?height=1080&width=1920",
  },
  {
    question: "What's our anniversary date?",
    options: ["Feb 14", "Mar 20", "Jun 15", "Sep 22"],
    correctAnswer: "Jun 15",
    backgroundImage: "/placeholder.svg?height=1080&width=1920",
  },
  // Add more questions here
]

export default function ValentinesQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showHearts, setShowHearts] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
      setShowHearts(true)
      setTimeout(() => setShowHearts(false), 2000)
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000)
    } else {
      // Quiz is completed
      setTimeout(() => setQuizCompleted(true), 1000)
    }
  }

  return (
    <main className={styles.main} style={{ backgroundImage: `url(${questions[currentQuestion].backgroundImage})` }}>
      {!quizCompleted ? (
        <div className={styles.quizContainer}>
          <h1 className={styles.title}>Our Love Quiz</h1>
          <Question
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
          />
          <p className={styles.score}>
            Score: {score}/{questions.length}
          </p>
        </div>
      ) : (
        <div className={styles.quizContainer}>
          <h2 className={styles.title}>Quiz Completed!</h2>
          <p className={styles.score}>
            Final Score: {score}/{questions.length}
          </p>
          <p className={styles.message}>Now, lets play a game! Help Cupid avoid the hearts.</p>
          <CupidGame />
        </div>
      )}
      {showHearts && <HeartAnimation />}
    </main>
  )
}

