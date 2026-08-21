"use client"

import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DifficultyKey, ThemeKey } from "@/lib/memory-game/types"

interface Option {
  key: string
  label: string
}

interface DifficultyOption extends Option {
  dims: string
  bestText: string
}

interface ThemeOption extends Option {
  sample: string
}

interface TitleScreenProps {
  isMobile: boolean
  difficultyOptions: DifficultyOption[]
  selectedDifficulty: DifficultyKey
  onDifficultySelect: (key: DifficultyKey) => void
  themeOptions: ThemeOption[]
  selectedTheme: ThemeKey
  onThemeSelect: (key: ThemeKey) => void
  onStart: () => void
  onHowToPlay: () => void
}

const sectionLabel: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0.08,
  textTransform: "uppercase",
  color: "rgba(244, 242, 237, 0.5)",
}

const difficultyItemClass =
  "h-auto min-w-[130px] justify-start gap-0.5 rounded-[12px] border border-white/15 bg-transparent px-4 py-3 text-left ring-white/10 " +
  "aria-pressed:border-game-yellow aria-pressed:bg-game-yellow/10 hover:bg-white/5 hover:text-game-cream " +
  "data-[pressed]:border-game-yellow data-[pressed]:bg-game-yellow/10"

const themeItemClass =
  "h-auto min-w-[96px] justify-center gap-1 rounded-[10px] border border-white/15 bg-transparent px-4 py-3 ring-white/10 " +
  "aria-pressed:border-game-yellow aria-pressed:bg-game-yellow/10 hover:bg-white/5 hover:text-game-cream " +
  "data-[pressed]:border-game-yellow data-[pressed]:bg-game-yellow/10"

export function TitleScreen({
  isMobile,
  difficultyOptions,
  selectedDifficulty,
  onDifficultySelect,
  themeOptions,
  selectedTheme,
  onThemeSelect,
  onStart,
  onHowToPlay,
}: TitleScreenProps) {
  const wordmark: CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: isMobile ? 48 : 64,
    letterSpacing: 1,
    lineHeight: 0.85,
    color: "#F4F2ED",
  }

  const subtitle: CSSProperties = {
    fontSize: 14,
    color: "rgba(244, 242, 237, 0.6)",
    marginTop: 10,
  }

  return (
    <div
      className="flex w-full flex-col animate-game-screen-in"
      style={{ gap: isMobile ? 28 : 32 }}
    >
      <div>
        <div style={wordmark}>
          Match
          <br />
          Cards
        </div>
        <div style={subtitle}>Train your memory with a classic match game</div>
      </div>

      <div className="flex w-full flex-col" style={{ gap: 12 }}>
        <div style={sectionLabel}>Difficulty</div>
        <ToggleGroup
          className="w-full flex-wrap justify-start gap-2.5"
          value={[selectedDifficulty]}
          onValueChange={(values) => {
            const next = values[0]
            if (typeof next === "string") onDifficultySelect(next as DifficultyKey)
          }}
        >
          {difficultyOptions.map((opt) => (
            <ToggleGroupItem key={opt.key} value={opt.key} className={difficultyItemClass}>
              <span className="flex flex-col items-start" style={{ gap: 2 }}>
                <span className="text-[15px] font-bold text-game-cream">{opt.label}</span>
                <span className="text-xs text-game-cream/55">{opt.dims}</span>
                <span className="text-[11px] text-game-yellow">{opt.bestText}</span>
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex w-full flex-col" style={{ gap: 12 }}>
        <div style={sectionLabel}>Theme</div>
        <ToggleGroup
          className="w-full flex-wrap justify-start gap-2.5"
          value={[selectedTheme]}
          onValueChange={(values) => {
            const next = values[0]
            if (typeof next === "string") onThemeSelect(next as ThemeKey)
          }}
        >
          {themeOptions.map((opt) => (
            <ToggleGroupItem key={opt.key} value={opt.key} className={themeItemClass}>
              <span className="text-xl leading-none text-game-cream">{opt.sample}</span>
              <span className="text-xs font-bold text-game-cream">{opt.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div
        className="flex flex-wrap items-center"
        style={{ gap: isMobile ? 12 : 16, marginTop: 6 }}
      >
        <Button
          onClick={onStart}
          className="h-auto rounded-full bg-game-yellow px-8 py-4 text-base font-extrabold text-game-ink hover:bg-game-yellow/85 hover:text-game-ink"
        >
          New Game
        </Button>
        <Button
          onClick={onHowToPlay}
          variant="outline"
          className="h-auto rounded-full border-white/25 bg-transparent px-6 py-4 text-base font-bold text-game-cream hover:bg-white/5 hover:text-game-cream"
        >
          How to play
        </Button>
      </div>
    </div>
  )
}