import type { DifficultyConfig, DifficultyKey, ThemeConfig, ThemeKey } from "./types"

export const MEMORIZE_DURATION = 2

export const BEST_STORAGE_KEY = "matchcards_best_v1"

export const DIFFICULTY_ORDER: DifficultyKey[] = ["easy", "medium", "hard", "expert"]

export const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  easy: { cols: 4, rows: 4, pairs: 8, maxMistakes: 20, label: "Easy" },
  medium: { cols: 6, rows: 4, pairs: 12, maxMistakes: 28, label: "Medium" },
  hard: { cols: 6, rows: 6, pairs: 18, maxMistakes: 36, label: "Hard" },
  expert: { cols: 8, rows: 8, pairs: 32, maxMistakes: 56, label: "Expert" },
}

export const THEME_ORDER: ThemeKey[] = ["spooky", "animals", "food", "space", "sports"]

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  spooky: {
    label: "Spooky",
    emojis: [
      "👻", "👽", "🤖", "🤡", "🎃", "😈", "💀", "☠️",
      "🧟", "🧛", "🧙", "🦇", "🕷️", "🕸️", "🔮", "⚰️",
      "🪦", "😱", "🌙", "⚡", "🕯️", "🐺", "🍬", "🍭",
      "🩸", "⛓️", "🗝️", "🧪", "🐈‍⬛", "🦉", "🌑", "🍂",
      "🎇",
    ],
  },
  animals: {
    label: "Animals",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
      "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
      "🐧", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴",
      "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦓",
      "🦒",
    ],
  },
  food: {
    label: "Food",
    emojis: [
      "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒",
      "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑",
      "🥦", "🥕", "🌽", "🌶️", "🍄", "🥐", "🍞", "🧀",
      "🥚", "🥓", "🥞", "🧇", "🍔", "🍟", "🍕", "🌭",
      "🍩",
    ],
  },
  space: {
    label: "Space",
    emojis: [
      "🚀", "🛸", "🌍", "🌎", "🌏", "🌕", "🌖", "🌗",
      "🌘", "🌑", "🌒", "🌓", "🌔", "🌟", "⭐", "🌌",
      "🪐", "🛰️", "👨‍🚀", "👩‍🚀", "🌠", "🔭", "☄️", "🌞",
      "🌛", "🌜", "🌚", "💫", "👾", "🌈", "🧑‍🚀", "🌃",
      "✨",
    ],
  },
  sports: {
    label: "Sports",
    emojis: [
      "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱",
      "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "🏏", "🥊",
      "🥋", "⛳", "🏹", "🎣", "🤿", "🏄", "🚴", "🏊",
      "🤸", "🏇", "🏆", "🥇", "🥈", "🥉", "🎽", "🛹",
      "🏂",
    ],
  },
}

export const CONFETTI_COLORS = ["#F2E62E", "#B47FF5", "#D9C4F2", "#F4F2ED"]