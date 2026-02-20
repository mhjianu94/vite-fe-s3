import { User } from "lucide-react"
import { useAtomValue } from "jotai"
import { displayNameAtom } from "@/atoms/auth"
import { signOut } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function UserMenu({ className }: { className?: string }) {
  const displayName = useAtomValue(displayNameAtom)
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut().then(() => navigate("/")).catch(() => navigate("/"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 h-9 px-2",
            className
          )}
          aria-label="User menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </span>
          <span className="max-w-[160px] truncate font-normal" title={displayName}>
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
