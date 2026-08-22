export type DifficultyKey = "easy" | "medium" | "hard" | "expert"

export type ThemeKey = "spooky" | "animals" | "food" | "space" | "sports"

export type Screen = "title" | "game" | "won" | "lost"

export type GamePhase = "idle" | "memorize" | "playing" | "paused"

export interface DifficultyConfig {
  cols: number
  rows: number
  pairs: number
  maxMistakes: number
  label: string
}

export interface ThemeConfig {
  label: string
  emojis: string[]
}

export interface Card {
  symbol: string
  matched: boolean
}

export interface BestEntry {
  score: number
  moves: number
  time: number
}

export type BestStore = Partial<Record<DifficultyKey, BestEntry>>

export interface ConfettiPiece {
  id: number
  left: number
  bg: string
  delay: string
  duration: string
  size: number
}

export type ToneKind = "flip" | "match" | "mismatch" | "win"

export interface TimeParts {
  main: string
  cents: string
}

export interface BoardLayout {
  outerPad: number
  panelPad: number
  gap: number
  cardSize: number
  emojiSize: number
  radius: number
  maxPanelW: number
  isMobile: boolean
}