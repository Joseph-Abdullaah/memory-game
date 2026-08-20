"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties } from "react"

import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  MEMORIZE_DURATION,
  THEMES,
  THEME_ORDER,
} from "@/lib/memory-game/constants"
import {
  buildConfetti,
  computeScore,
  computeLayout,
  formatMillis,
  generateCards,
  loadBest,
  saveBest,
} from "@/lib/memory-game/utils"
import { SoundEngine } from "@/lib/memory-game/sound"
import type {
  BestEntry,
  BestStore,
  Card,
  ConfettiPiece,
  DifficultyKey,
  GamePhase,
  Screen,
  ThemeKey,
  TimeParts,
} from "@/lib/memory-game/types"

import { GameScreen } from "./game-screen"
import { LoseScreen, WinScreen } from "./result-screens"
import { HowToPlayOverlay, PauseOverlay } from "./overlays"
import { TitleScreen } from "./title-screen"

const DEFAULT_VIEWPORT = { width: 1024, height: 768 }

let viewportCache = DEFAULT_VIEWPORT
let viewportInitialized = false

function getViewportSnapshot() {
  if (typeof window !== "undefined" && !viewportInitialized) {
    viewportInitialized = true
    viewportCache = { width: window.innerWidth, height: window.innerHeight }
  }
  return viewportCache
}

function subscribeViewport(callback: () => void) {
  const onResize = () => {
    const next = { width: window.innerWidth, height: window.innerHeight }
    if (next.width !== viewportCache.width || next.height !== viewportCache.height) {
      viewportCache = next
      callback()
    }
  }
  window.addEventListener("resize", onResize)
  return () => window.removeEventListener("resize", onResize)
}

const EMPTY_BEST: BestStore = {}
let bestCache: BestStore = EMPTY_BEST
let bestInitialized = false
let bestListeners: Array<() => void> = []

function getBestSnapshot() {
  if (typeof window !== "undefined" && !bestInitialized) {
    bestInitialized = true
    bestCache = loadBest()
  }
  return bestCache
}

function subscribeBest(callback: () => void) {
  bestListeners.push(callback)
  return () => {
    bestListeners = bestListeners.filter((listener) => listener !== callback)
  }
}

function emitBest() {
  for (const listener of bestListeners) listener()
}

function useBestStore(): [BestStore, (store: BestStore) => void] {
  const store = useSyncExternalStore(subscribeBest, getBestSnapshot, () => EMPTY_BEST)
  const update = useCallback((next: BestStore) => {
    bestCache = next
    emitBest()
  }, [])
  return [store, update]
}

export function MemoryGame() {
  const [screen, setScreen] = useState<Screen>("title")
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle")
  const [difficulty, setDifficulty] = useState<DifficultyKey>("easy")
  const [theme, setTheme] = useState<ThemeKey>("spooky")

  const [cards, setCards] = useState<Card[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const [memorizeCountdown, setMemorizeCountdown] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  const [best, setBestStore] = useBestStore()
  const [score, setScore] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const [showInstructions, setShowInstructions] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const viewport = useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    () => DEFAULT_VIEWPORT
  )

  const stateRef = useRef({
    screen,
    gamePhase,
    difficulty,
    theme,
    cards,
    flippedIndices,
    moves,
    mistakes,
    matchedCount,
    busy,
    elapsedMs,
    score,
    isNewBest,
  })

  const startTimestampRef = useRef(0)
  const mainTimerRef = useRef<number | null>(null)
  const memorizeTimerRef = useRef<number | null>(null)
  const resolveTimerRef = useRef<number | null>(null)
  const soundRef = useRef<SoundEngine | null>(null)

  if (soundRef.current == null) {
    soundRef.current = new SoundEngine()
  }

  useEffect(() => {
    stateRef.current = {
      screen,
      gamePhase,
      difficulty,
      theme,
      cards,
      flippedIndices,
      moves,
      mistakes,
      matchedCount,
      busy,
      elapsedMs,
      score,
      isNewBest,
    }
  })

  useEffect(() => {
    soundRef.current?.setEnabled(soundOn)
  }, [soundOn])

  useEffect(() => {
    return () => {
      if (mainTimerRef.current !== null) window.clearInterval(mainTimerRef.current)
      if (memorizeTimerRef.current !== null) window.clearInterval(memorizeTimerRef.current)
      if (resolveTimerRef.current !== null) window.clearTimeout(resolveTimerRef.current)
    }
  }, [])

  const clearMainTimer = () => {
    if (mainTimerRef.current !== null) {
      window.clearInterval(mainTimerRef.current)
      mainTimerRef.current = null
    }
  }

  const clearTimers = () => {
    clearMainTimer()
    if (memorizeTimerRef.current !== null) {
      window.clearInterval(memorizeTimerRef.current)
      memorizeTimerRef.current = null
    }
    if (resolveTimerRef.current !== null) {
      window.clearTimeout(resolveTimerRef.current)
      resolveTimerRef.current = null
    }
  }

  const startMainTimer = () => {
    clearMainTimer()
    mainTimerRef.current = window.setInterval(() => {
      if (stateRef.current.gamePhase === "playing") {
        setElapsedMs(Date.now() - startTimestampRef.current)
      }
    }, 50)
  }

  const startGame = () => {
    clearTimers()
    const conf = DIFFICULTIES[stateRef.current.difficulty]
    const deck = generateCards(THEMES[stateRef.current.theme].emojis, conf.pairs)
    setScreen("game")
    setGamePhase("memorize")
    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
    setMistakes(0)
    setMatchedCount(0)
    setBusy(false)
    setElapsedMs(0)
    setMemorizeCountdown(MEMORIZE_DURATION)
    setConfetti([])
    setIsNewBest(false)

    let countdown = MEMORIZE_DURATION
    memorizeTimerRef.current = window.setInterval(() => {
      countdown -= 1
      if (countdown <= 0) {
        if (memorizeTimerRef.current !== null) {
          window.clearInterval(memorizeTimerRef.current)
          memorizeTimerRef.current = null
        }
        startTimestampRef.current = Date.now()
        setGamePhase("playing")
        setMemorizeCountdown(0)
        startMainTimer()
      } else {
        setMemorizeCountdown(countdown)
      }
    }, 1000)
  }

  const pauseGame = () => {
    if (stateRef.current.gamePhase !== "playing") return
    clearMainTimer()
    setGamePhase("paused")
  }

  const resumeGame = () => {
    if (stateRef.current.gamePhase !== "paused") return
    startTimestampRef.current = Date.now() - stateRef.current.elapsedMs
    setGamePhase("playing")
    startMainTimer()
  }

  const quitToMenu = () => {
    clearTimers()
    setScreen("title")
    setGamePhase("idle")
  }

  const finishGame = (won: boolean) => {
    clearMainTimer()
    const s = stateRef.current
    if (won) {
      const conf = DIFFICULTIES[s.difficulty]
      const newScore = computeScore(conf.pairs, s.moves, s.mistakes, s.elapsedMs)
      const bestStore = loadBest()
      const prev = bestStore[s.difficulty]
      const isBest = !prev || newScore > prev.score
      if (isBest) {
        bestStore[s.difficulty] = { score: newScore, moves: s.moves, time: s.elapsedMs }
        saveBest(bestStore)
        setBestStore(bestStore)
      }
      soundRef.current?.play("win")
      setScore(newScore)
      setIsNewBest(isBest)
      setConfetti(buildConfetti())
      setScreen("won")
    } else {
      setScreen("lost")
    }
  }

  const resolvePair = () => {
    const s = stateRef.current
    const [a, b] = s.flippedIndices
    if (a === undefined || b === undefined) {
      setBusy(false)
      return
    }
    const nextCards = [...s.cards]
    const isMatch = nextCards[a].symbol === nextCards[b].symbol
    if (isMatch) {
      nextCards[a] = { ...nextCards[a], matched: true }
      nextCards[b] = { ...nextCards[b], matched: true }
      const newMatched = s.matchedCount + 1
      setCards(nextCards)
      setFlippedIndices([])
      setBusy(false)
      setMatchedCount(newMatched)
      soundRef.current?.play("match")
      if (newMatched === DIFFICULTIES[s.difficulty].pairs) {
        finishGame(true)
      }
    } else {
      const newMistakes = s.mistakes + 1
      setFlippedIndices([])
      setBusy(false)
      setMistakes(newMistakes)
      soundRef.current?.play("mismatch")
      if (newMistakes >= DIFFICULTIES[s.difficulty].maxMistakes) {
        finishGame(false)
      }
    }
  }

  const handleCardClick = (index: number) => {
    const s = stateRef.current
    if (s.gamePhase !== "playing" || s.busy) return
    const card = s.cards[index]
    if (!card || card.matched || s.flippedIndices.includes(index)) return
    soundRef.current?.play("flip")
    const nextFlipped = [...s.flippedIndices, index]
    if (nextFlipped.length < 2) {
      setFlippedIndices(nextFlipped)
      return
    }
    setFlippedIndices(nextFlipped)
    setMoves(s.moves + 1)
    setBusy(true)
    resolveTimerRef.current = window.setTimeout(resolvePair, 650)
  }

  const conf = DIFFICULTIES[difficulty]
  const layout = computeLayout(viewport.width, viewport.height, conf)

  const cardsView = useMemo(
    () =>
      cards.map((card, index) => {
        const flippedNow = flippedIndices.includes(index)
        const faceUp = card.matched || flippedNow || gamePhase === "memorize"
        return {
          index,
          symbol: card.symbol,
          faceUp,
          matched: card.matched,
          clickable: gamePhase === "playing" && !card.matched && !flippedNow,
        }
      }),
    [cards, flippedIndices, gamePhase]
  )

  const current = formatMillis(elapsedMs)
  const bestEntry: BestEntry | undefined = best[difficulty]
  const bestTime = bestEntry ? formatMillis(bestEntry.time) : { main: "--:--", cents: "--" }

  const difficultyOptions = DIFFICULTY_ORDER.map((key) => ({
    key,
    label: DIFFICULTIES[key].label,
    dims: `${DIFFICULTIES[key].cols}\u00d7${DIFFICULTIES[key].rows} \u00b7 ${DIFFICULTIES[key].pairs} pairs`,
    bestText: best[key] ? `Best ${best[key].score}` : "No best yet",
  }))

  const themeOptions = THEME_ORDER.map((key) => ({
    key,
    label: THEMES[key].label,
    sample: THEMES[key].emojis.slice(0, 3).join(" "),
  }))

  const boardStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${conf.cols}, ${layout.cardSize}px)`,
    gap: `${layout.gap}px`,
    justifyContent: "center",
  }

  const isWon = screen === "won"
  const panelMaxWidth = screen === "title" ? 520 : layout.maxPanelW
  const panelStyle: CSSProperties = {
    background: isWon ? "#D9C4F2" : "#0A0A0A",
    borderRadius: layout.isMobile ? 28 : 40,
    padding: layout.panelPad,
    width: "100%",
    maxWidth: panelMaxWidth,
    color: isWon ? "#0A0A0A" : "#F4F2ED",
    minHeight: isWon || screen === "lost" ? Math.min(viewport.height * 0.8, 700) : undefined,
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: layout.isMobile ? 20 : 28,
  }

  const outerStyle: CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    background: "#0A0A0A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: layout.outerPad,
    fontFamily: "'Inter', sans-serif",
  }

  const resultTime: TimeParts = formatMillis(elapsedMs)
  const resultProps = {
    isMobile: layout.isMobile,
    timeMain: resultTime.main,
    timeCents: resultTime.cents,
    moves,
    onRestart: startGame,
    onMenu: quitToMenu,
  }

  return (
    <div style={outerStyle}>
      <div style={panelStyle}>
        {screen === "title" && (
          <TitleScreen
            isMobile={layout.isMobile}
            difficultyOptions={difficultyOptions}
            selectedDifficulty={difficulty}
            onDifficultySelect={setDifficulty}
            themeOptions={themeOptions}
            selectedTheme={theme}
            onThemeSelect={setTheme}
            onStart={startGame}
            onHowToPlay={() => setShowInstructions(true)}
          />
        )}

        {screen === "game" && (
          <GameScreen
            isMobile={layout.isMobile}
            cardSize={layout.cardSize}
            radius={layout.radius}
            emojiSize={layout.emojiSize}
            gamePhase={gamePhase}
            memorizeCountdown={memorizeCountdown}
            boardStyle={boardStyle}
            cardsView={cardsView}
            onCardClick={handleCardClick}
            moves={moves}
            matchedText={`${matchedCount}/${conf.pairs}`}
            mistakesText={`${mistakes}/${conf.maxMistakes}`}
            showMistakes={difficulty === "easy" || difficulty === "medium"}
            mistakesRemaining={Math.max(0, conf.maxMistakes - mistakes)}
            timeMain={current.main}
            timeCents={current.cents}
            bestMain={bestTime.main}
            bestCents={bestTime.cents}
            musicOn={musicOn}
            soundOn={soundOn}
            onToggleMusic={() => setMusicOn((v) => !v)}
            onToggleSound={() => setSoundOn((v) => !v)}
            onPause={pauseGame}
            onMenu={quitToMenu}
          />
        )}

        {screen === "won" && (
          <WinScreen
            {...resultProps}
            light={true}
            score={score}
            isNewBest={isNewBest}
            confetti={confetti}
          />
        )}

        {screen === "lost" && <LoseScreen {...resultProps} light={false} />}
      </div>

      <PauseOverlay
        open={screen === "game" && gamePhase === "paused"}
        onResume={resumeGame}
        onQuit={quitToMenu}
      />
      <HowToPlayOverlay open={showInstructions} onOpenChange={setShowInstructions} />
    </div>
  )
}