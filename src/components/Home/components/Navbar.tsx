import { Moon, Sun } from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import { themeAtom, type Theme } from "@/atoms/theme"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/Home/components/UserMenu"
import { cn } from "@/lib/utils"

export function Navbar({ className }: { className?: string }) {
  const theme = useAtomValue(themeAtom)
  const setTheme = useSetAtom(themeAtom)

  const toggleTheme = () => {
    setTheme((prev: Theme) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950",
        className
      )}
    >
      <div className="font-semibold text-gray-900 dark:text-white">Home</div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
