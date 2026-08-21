"use client"

import { Button } from "@/components/ui/button"
import type { ConfettiPiece } from "@/lib/memory-game/types"
import { Confetti } from "./confetti"

interface ResultLayout {
  isMobile: boolean
  light: boolean
  timeMain: string
  timeCents: string
  moves: number
  score?: number
  isNewBest?: boolean
  confetti?: ConfettiPiece[]
  onRestart: () => void
  onMenu: () => void
}

interface ResultScreenProps extends ResultLayout {
  headline: string
  restartLabel: string
}

function ResultScreen({
  isMobile,
  light,
  headline,
  timeMain,
  timeCents,
  moves,
  score,
  isNewBest,
  confetti,
  onRestart,
  onMenu,
  restartLabel,
}: ResultScreenProps) {
  const ink = light ? "#0A0A0A" : "#F4F2ED"
  const inkSoft = light ? "rgba(10, 10, 10, 0.5)" : "rgba(244, 242, 237, 0.5)"
  const headlineColor = light ? ink : "#D9C4F2"

  const stats = [
    { label: "Time", value: `${timeMain}.${timeCents}` },
    { label: "Moves", value: String(moves) },
    ...(score !== undefined ? [{ label: "Score", value: String(score) }] : []),
  ]

  const restartClass = light
    ? "h-auto rounded-full bg-game-ink px-8 py-4 text-base font-extrabold text-game-cream hover:bg-game-ink/85 hover:text-game-cream"
    : "h-auto rounded-full bg-game-yellow px-8 py-4 text-base font-extrabold text-game-ink hover:bg-game-yellow/85 hover:text-game-ink"

  const headerMenuClass = light
    ? "h-auto rounded-full border border-game-ink/35 bg-transparent px-5 py-2.5 text-sm font-bold text-game-ink hover:bg-game-ink/10 hover:text-game-ink"
    : "h-auto rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-sm font-bold text-game-cream hover:bg-white/10 hover:text-game-cream"

  const setupClass = light
    ? "h-auto rounded-full border border-game-ink/35 bg-transparent px-6 py-4 text-base font-bold text-game-ink hover:bg-game-ink/10 hover:text-game-ink"
    : "h-auto rounded-full border border-white/25 bg-transparent px-6 py-4 text-base font-bold text-game-cream hover:bg-white/5 hover:text-game-cream"

  return (
    <div
      className="relative flex flex-1 flex-col animate-game-screen-in"
      style={{ gap: isMobile ? 16 : 24 }}
    >
      {confetti && <Confetti pieces={confetti} />}

      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            letterSpacing: 0.5,
            color: ink,
          }}
        >
          MATCH CARDS
        </span>
        <Button type="button" onClick={onMenu} className={headerMenuClass}>
          Menu
        </Button>
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center text-center"
        style={{ gap: 28 }}
      >
        <div
          className="animate-game-pop-in"
          style={{
            fontSize: isMobile ? 28 : 36,
            fontWeight: 800,
            lineHeight: 1,
            color: headlineColor,
          }}
        >
          {headline}
        </div>

        {isNewBest && (
          <div
            className="animate-game-pop-in"
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 0.06,
              textTransform: "uppercase",
              color: inkSoft,
            }}
          >
            New best score
          </div>
        )}

        <div className="flex" style={{ gap: isMobile ? 24 : 48 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center" style={{ gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 0.08,
                  textTransform: "uppercase",
                  color: inkSoft,
                }}
              >
                {stat.label}
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: ink }}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: isMobile ? 12 : 16 }}
        >
          <Button type="button" onClick={onRestart} className={restartClass}>
            {restartLabel}
          </Button>
          <Button type="button" onClick={onMenu} variant="outline" className={setupClass}>
            Change setup
          </Button>
        </div>
      </div>
    </div>
  )
}

export function WinScreen(props: ResultLayout) {
  return (
    <ResultScreen
      {...props}
      headline={props.isNewBest ? "🔥 You are on fire!" : "You win!"}
      restartLabel="Play again"
    />
  )
}

export function LoseScreen(props: ResultLayout) {
  return (
    <ResultScreen {...props} light={false} headline="You lost!" restartLabel="Try again" />
  )
}