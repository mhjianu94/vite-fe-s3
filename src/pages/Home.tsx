import { Navbar } from "@/components/Home/components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome home
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This is your home page. You’re signed in and can use the navbar to sign out.
        </p>
      </main>
    </div>
  )
}
