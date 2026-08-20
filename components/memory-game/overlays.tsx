"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const popupClasses =
  "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-[#141414] p-6 text-sm text-game-cream ring-1 ring-white/10 outline-none sm:max-w-[380px] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

const titleClasses =
  "font-display text-center text-3xl font-normal leading-none tracking-wide text-game-cream"

function RulesList() {
  const rules = [
    "Flip two cards to find matching pairs",
    "Each match adds to your score",
    "Too many mistakes ends the game",
    "Earn bonuses for fewer moves and faster times",
    "Beat your best score on every difficulty",
  ]
  return (
    <ul className="flex list-none flex-col gap-3">
      {rules.map((rule) => (
        <li key={rule} className="flex items-start gap-3">
          <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-game-yellow" />
          <span className="text-sm leading-relaxed text-game-cream/80">{rule}</span>
        </li>
      ))}
    </ul>
  )
}

const primaryButtonClass =
  "h-auto rounded-full bg-game-yellow px-8 py-3 text-base font-extrabold text-game-ink hover:bg-game-yellow/85 hover:text-game-ink"

const ghostButtonClass =
  "h-auto rounded-full border border-white/25 bg-transparent px-8 py-3 text-base font-bold text-game-cream hover:bg-white/5 hover:text-game-cream"

export function PauseOverlay({
  open,
  onResume,
  onQuit,
}: {
  open: boolean
  onResume: () => void
  onQuit: () => void
}) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && open) onResume()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/70 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className={popupClasses}>
          <DialogPrimitive.Title className={titleClasses}>Paused</DialogPrimitive.Title>
          <div className="flex flex-col gap-3 pt-2">
            <Button type="button" onClick={onResume} className={primaryButtonClass}>
              Resume
            </Button>
            <Button type="button" onClick={onQuit} variant="outline" className={ghostButtonClass}>
              Quit to menu
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function HowToPlayOverlay({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/70 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className={cn(popupClasses)}>
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2 text-game-cream/70 hover:bg-white/10 hover:text-game-cream"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          <DialogPrimitive.Title className={titleClasses}>How to play</DialogPrimitive.Title>
          <div className="pt-1">
            <RulesList />
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className={primaryButtonClass}
            >
              Got it!
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}