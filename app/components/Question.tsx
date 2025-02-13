"use client"

import { useState } from "react"
import styles from "./Question.module.css"

interface QuestionProps {
  question: string
  options: string[]
  onAnswer: (answer: string) => void
}

export default function Question({ question, options, onAnswer }: QuestionProps) {
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (option: string) => {
    if (!answered) {
      setAnswered(true)
      onAnswer(option)
      setTimeout(() => setAnswered(false), 1000)
    }
  }

  return (
    <div className={styles.questionContainer}>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.options}>
        {options.map((option, index) => (
          <button key={index} className={styles.option} onClick={() => handleAnswer(option)} disabled={answered}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

