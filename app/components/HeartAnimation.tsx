import styles from "./HeartAnimation.module.css"

export default function HeartAnimation() {
  return (
    <div className={styles.heartContainer}>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={styles.heart}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

