"use client"

import type { CSSProperties } from "react"

import { Music, Pause, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { GamePhase } from "@/lib/memory-game/types"
import { GameCard } from "./game-card"

export interface GameCardView {
  index: number
  symbol: string
  faceUp: boolean
  matched: boolean
  clickable: boolean
}

interface GameScreenProps {
  isMobile: boolean
  cardSize: number
  radius: number
  emojiSize: number
  gamePhase: GamePhase
  memorizeCountdown: number
  boardStyle: CSSProperties
  cardsView: GameCardView[]
  onCardClick: (index: number) => void
  moves: number
  matchedText: string
  mistakesText: string
  showMistakes: boolean
  mistakesRemaining: number
  timeMain: string
  timeCents: string
  bestMain: string
  bestCents: string
  musicOn: boolean
  soundOn: boolean
  onToggleMusic: () => void
  onToggleSound: () => void
  onPause: () => void
  onMenu: () => void
}

const headerLabel: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0.08,
  textTransform: "uppercase",
  color: "rgba(244, 242, 237, 0.5)",
}

const headerValue: CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#F4F2ED",
}

const timerCents: CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "rgba(244, 242, 237, 0.6)",
}

const outIconButton =
  "size-[38px] rounded-full border border-white/20 bg-transparent text-game-cream hover:bg-white/10 hover:text-game-cream"

export function GameScreen({
  isMobile,
  cardSize,
  radius,
  emojiSize,
  gamePhase,
  memorizeCountdown,
  boardStyle,
  cardsView,
  onCardClick,
  moves,
  matchedText,
  mistakesText,
  showMistakes,
  mistakesRemaining,
  timeMain,
  timeCents,
  bestMain,
  bestCents,
  musicOn,
  soundOn,
  onToggleMusic,
  onToggleSound,
  onPause,
  onMenu,
}: GameScreenProps) {
  return (
    <div
      className="flex w-full flex-col animate-game-screen-in"
      style={{ gap: 20 }}
    >
      <div className="flex items-center justify-between" style={{ gap: 12 }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20,
            letterSpacing: 0.5,
            color: "#F4F2ED",
          }}
        >
          MATCH CARDS
        </span>
        <div className="flex items-center" style={{ gap: 8 }}>
          <Button
            type="button"
            onClick={onToggleMusic}
            size="icon"
            aria-label={musicOn ? "Mute music" : "Unmute music"}
            className={outIconButton}
            style={{ opacity: musicOn ? 1 : 0.4 }}
          >
            <Music />
          </Button>
          <Button
            type="button"
            onClick={onToggleSound}
            size="icon"
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
            className={outIconButton}
            style={{ opacity: soundOn ? 1 : 0.4 }}
          >
            {soundOn ? <Volume2 /> : <VolumeX />}
          </Button>
          {gamePhase === "playing" && (
            <Button
              type="button"
              onClick={onPause}
              size="icon"
              aria-label="Pause game"
              className={outIconButton}
            >
              <Pause />
            </Button>
          )}
        </div>
      </div>

      <div
        className="flex items-start justify-between"
        style={{ gap: isMobile ? 12 : 24 }}
      >
        <div className="flex flex-1 flex-wrap" style={{ gap: isMobile ? 16 : 28 }}>
          <div className="flex flex-col">
            <span style={headerLabel}>Moves</span>
            <span style={headerValue}>{moves}</span>
          </div>
          <div className="flex flex-col">
            <span style={headerLabel}>Matched</span>
            <span style={headerValue}>{matchedText}</span>
          </div>
          <div className="flex flex-col">
            <span style={headerLabel}>Mistakes</span>
            {showMistakes ? (
              <span style={headerValue}>{mistakesText}</span>
            ) : (
              <span className="flex items-center" style={{ gap: 3, marginTop: 7 }}>
                {Array.from({ length: mistakesRemaining }).map((_, i) => (
                  <span key={i} className="h-2.5 w-[14px] rounded-md bg-game-yellow/70" />
                ))}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end" style={{ gap: 8 }}>
          <div className="flex items-baseline" style={{ gap: 6 }}>
            <span
              className="text-xs"
              style={{ color: "rgba(244, 242, 237, 0.5)", letterSpacing: 0.04 }}
            >
              BEST
            </span>
            <span style={{ ...headerValue, fontSize: 16 }}>
              {bestMain}
              <span className="text-[11px] text-game-cream/60">.{bestCents}</span>
            </span>
          </div>
          <div className="flex items-baseline" style={{ gap: 6 }}>
            <span
              className="text-xs"
              style={{ color: "rgba(244, 242, 237, 0.5)", letterSpacing: 0.04 }}
            >
              TIME
            </span>
            <span style={{ ...headerValue, fontSize: 20 }}>
              {timeMain}
              <span style={timerCents}>.{timeCents}</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: "100%", flex: "1 1 auto" }}
      >
        {gamePhase === "memorize" && (
          <div
            className="pointer-events-none absolute left-0 right-0 -top-7 text-center"
            style={{
              fontSize: 13,
              letterSpacing: 0.06,
              textTransform: "uppercase",
              color: "#F2E62E",
            }}
          >
            Memorize! {memorizeCountdown}
          </div>
        )}
        <div style={boardStyle}>
          {cardsView.map((card) => (
            <GameCard
              key={card.index}
              symbol={card.symbol}
              size={cardSize}
              radius={radius}
              emojiSize={emojiSize}
              faceUp={card.faceUp}
              matched={card.matched}
              clickable={card.clickable}
              onClick={() => onCardClick(card.index)}
            />
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={onMenu}
        className="h-auto self-end rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-sm font-bold text-game-cream hover:bg-white/10 hover:text-game-cream"
      >
        Menu
      </Button>
    </div>
  )
}