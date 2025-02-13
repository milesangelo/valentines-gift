import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Valentine\'s Day Quiz',
  description: 'A fun Valentine\'s Day quiz and game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}