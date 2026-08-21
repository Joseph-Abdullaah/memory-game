import type { ConfettiPiece } from "@/lib/memory-game/types"

export function Confetti({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-30px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${Math.round(p.size * 1.6)}px`,
            background: p.bg,
            borderRadius: "2px",
            animation: `game-confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </span>
  )
}