import GameContainer from "@/components/game-container"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-700">
      <h1 className="text-4xl font-bold text-white mb-6">Платформер</h1>
      <GameContainer />
    </main>
  )
}