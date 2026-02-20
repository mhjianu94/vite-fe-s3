import { atom } from "jotai"
import { getDisplayNameFromToken } from "@/lib/auth"

export interface User {
  id: string
  email: string
  name?: string
}

export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)

/** Display name derived from user atom and token (parsing in atom layer). */
export const displayNameAtom = atom((get) => {
  const user = get(userAtom)
  const fromToken = getDisplayNameFromToken()
  return user?.name ?? fromToken ?? user?.email ?? "User"
})

