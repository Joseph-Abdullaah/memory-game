import { BEST_STORAGE_KEY, CONFETTI_COLORS } from "./constants"
import type {
  BestEntry,
  BestStore,
  BoardLayout,
  Card,
  ConfettiPiece,
  DifficultyConfig,
  TimeParts,
} from "./types"

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function generateCards(emojis: string[], pairs: number): Card[] {
  const pool = emojis.slice(0, pairs)
  const deck = shuffle([...pool, ...pool])
  return deck.map((symbol) => ({ symbol, matched: false }))
}

export function formatMillis(ms: number): TimeParts {
  const cent = Math.floor(ms / 10) % 100
  const totalSec = Math.floor(ms / 1000)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  const pad = (n: number) => String(n).padStart(2, "0")
  return { main: `${pad(min)}:${pad(sec)}`, cents: pad(cent) }
}

export function computeScore(
  pairs: number,
  moves: number,
  mistakes: number,
  elapsedMs: number
): number {
  return Math.max(
    0,
    Math.round(pairs * 100 - moves * 4 - mistakes * 10 - (elapsedMs / 1000) * 2)
  )
}

export function loadBest(): BestStore {
  try {
    const raw = localStorage.getItem(BEST_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BestStore) : {}
  } catch {
    return {}
  }
}

export function saveBest(store: BestStore) {
  try {
    localStorage.setItem(BEST_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // localStorage unavailable — play without persisting scores.
  }
}

export function buildConfetti(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = []
  for (let i = 0; i < 40; i++) {
    pieces.push({
      id: i,
      left: Math.random() * 100,
      bg: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: (Math.random() * 0.5).toFixed(2),
      duration: (1.4 + Math.random() * 0.9).toFixed(2),
      size: 6 + Math.round(Math.random() * 6),
    })
  }
  return pieces
}

export function computeLayout(vw: number, vh: number, conf: DifficultyConfig): BoardLayout {
  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1024
  const outerPad = isMobile ? 12 : isTablet ? 24 : 40
  const panelPad = isMobile ? 18 : isTablet ? 28 : 40

  const gap = conf.cols > 6 ? 8 : 12
  const maxPanelW = Math.min(vw - outerPad * 2, 1180)
  const availW = maxPanelW - panelPad * 2 - gap * (conf.cols - 1)
  let cardSize = availW / conf.cols
  const availH = Math.min(vh * 0.6, 620) - gap * (conf.rows - 1)
  cardSize = Math.min(cardSize, availH / conf.rows)
  cardSize = Math.max(30, Math.min(cardSize, 108))

  return {
    outerPad,
    panelPad,
    gap,
    cardSize,
    emojiSize: Math.round(cardSize * 0.5),
    radius: Math.round(cardSize * 0.22),
    maxPanelW,
    isMobile,
  }
}

export function bestTimeText(entry: BestEntry | undefined): TimeParts {
  return entry ? formatMillis(entry.time) : { main: "--:--", cents: "--" }
}