import { atom } from "jotai"

const THEME_STORAGE_KEY = "theme"

export type Theme = "light" | "dark"

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  return stored === "dark" || stored === "light" ? stored : "light"
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

export const themeAtom = atom<Theme>(getStoredTheme())

export function setThemeAndPersist(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function initTheme() {
  applyTheme(getStoredTheme())
}
