import type { ToneKind } from "./types"

interface ToneNote {
  f: number
  t: number
  d: number
  type: OscillatorType
}

const TONE_SEQUENCES: Record<ToneKind, ToneNote[]> = {
  flip: [{ f: 640, t: 0, d: 0.05, type: "triangle" }],
  match: [
    { f: 880, t: 0, d: 0.08, type: "sine" },
    { f: 1180, t: 0.08, d: 0.1, type: "sine" },
  ],
  mismatch: [{ f: 160, t: 0, d: 0.16, type: "sawtooth" }],
  win: [
    { f: 523, t: 0, d: 0.1, type: "square" },
    { f: 659, t: 0.1, d: 0.1, type: "square" },
    { f: 784, t: 0.2, d: 0.1, type: "square" },
    { f: 1046, t: 0.3, d: 0.18, type: "square" },
  ],
}

export class SoundEngine {
  private context: AudioContext | null = null
  private enabled = true

  setEnabled(value: boolean) {
    this.enabled = value
  }

  play(kind: ToneKind) {
    if (!this.enabled) return
    try {
      this.ensureContext()
    } catch {
      return
    }
    const ctx = this.context
    if (!ctx) return
    const notes = TONE_SEQUENCES[kind] || []
    for (const note of notes) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = note.type
      osc.frequency.value = note.f
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + note.t)
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + note.t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.t + note.d)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + note.t)
      osc.stop(ctx.currentTime + note.t + note.d + 0.02)
    }
  }

  private ensureContext() {
    if (!this.context) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) throw new Error("Web Audio not supported")
      this.context = new Ctor()
    }
    if (this.context.state === "suspended") {
      void this.context.resume()
    }
  }
}