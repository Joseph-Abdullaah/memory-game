import type { CSSProperties } from "react"

interface GameCardProps {
  symbol: string
  size: number
  radius: number
  emojiSize: number
  faceUp: boolean
  matched: boolean
  clickable: boolean
  onClick: () => void
}

export function GameCard({
  symbol,
  size,
  radius,
  emojiSize,
  faceUp,
  matched,
  clickable,
  onClick,
}: GameCardProps) {
  const backBg = matched ? "#F2E62E" : "#B47FF5"

  const innerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform .5s cubic-bezier(.2,.8,.2,1)",
    transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
  }

  const frontStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "#D9C4F2",
    borderRadius: radius,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  }

  const backStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: backBg,
    borderRadius: radius,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: emojiSize,
    userSelect: "none",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      aria-label={clickable ? `Flip card` : undefined}
      tabIndex={clickable ? 0 : -1}
      className="game-card-inner appearance-none rounded-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-game-yellow disabled:cursor-default disabled:opacity-100"
      style={{ width: size, height: size, perspective: "900px" }}
    >
      <span className="block" style={innerStyle}>
        <span style={frontStyle} aria-hidden />
        <span style={backStyle} aria-hidden>
          {symbol}
        </span>
      </span>
    </button>
  )
}