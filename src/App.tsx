import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useSetAtom, useAtomValue } from "jotai"
import Welcome from "@/pages/Welcome"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import { userAtom } from "@/atoms/auth"
import { themeAtom, setThemeAndPersist } from "@/atoms/theme"
import { getCurrentUserFromCognito, AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth"

function useHasToken() {
  return typeof window !== "undefined" && !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

function RootRoute() {
  const hasToken = useHasToken()
  if (hasToken) return <Navigate to="/home" replace />
  return <Welcome />
}

function HomeRoute() {
  const hasToken = useHasToken()
  if (!hasToken) return <Navigate to="/" replace />
  return <Home />
}

function App() {
  const setUser = useSetAtom(userAtom)
  const theme = useAtomValue(themeAtom)

  useEffect(() => {
    getCurrentUserFromCognito().then((user) => {
      if (user) setUser(user)
    })
  }, [setUser])

  useEffect(() => {
    setThemeAndPersist(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
