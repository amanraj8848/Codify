import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4, validate } from "uuid"
import { toast, Toaster } from "react-hot-toast"
import { Code2, Zap, Atom, Star } from "lucide-react"
// import "@radix-ui/themes/styles.css"

export default function JoinRoom() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [stars, setStars] = useState([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      }))
      setStars(newStars)
    }

    generateStars()
    window.addEventListener("resize", generateStars)
    return () => window.removeEventListener("resize", generateStars)
  }, [])

  const handleRoomSubmit = e => {
    e.preventDefault()
    if (!validate(roomId)) {
      toast.error("Incorrect room ID")
      return
    }
    username && navigate(`/room/${roomId}`, { state: { username } })
  }

  const createRoomId = () => {
    try {
      setRoomId(uuidv4())
      toast.success("Room created")
    } catch (exp) {
      console.error(exp)
      toast.error("Failed to create room")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-purple-900 text-white overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 z-0">
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-8 relative">
          {/* Codify Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-2 bg-black/50 backdrop-blur-md rounded-full px-6 py-3">
              <Code2 className="h-8 w-8 text-blue-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Codify
              </h1>
              <Zap className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-lg filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30">
            <h2 className="text-4xl font-bold text-center mb-2">Join Room</h2>
            <p className="text-xl text-center mb-8 text-blue-300">Enter room details to connect</p>
            <form onSubmit={handleRoomSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="roomIdInput" className="block text-sm font-medium text-blue-300">
                  Room ID
                </label>
                <input
                  id="roomIdInput"
                  type="text"
                  placeholder="Enter room ID"
                  required
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-blue-500 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="usernameInput" className="block text-sm font-medium text-blue-300">
                  Guest Username
                </label>
                <input
                  id="usernameInput"
                  type="text"
                  placeholder="Enter Guest Username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-blue-500 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                onSubmit={handleRoomSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
                Join Room
              </button>
            </form>
            <p className="text-sm text-gray-300 mt-4 text-center">
              Don't have an invite code?{" "}
              <button
                className="text-blue-400 hover:text-blue-300 underline focus:outline-none"
                onClick={createRoomId}>
                Create your own room
              </button>
            </p>
          </div>
          <div className="absolute -top-20 -left-20 -z-10">
            <Atom className="h-40 w-40 text-blue-500 opacity-20 animate-spin-slow" />
          </div>
          <div className="absolute -bottom-20 -right-20 -z-10">
            <Star className="h-40 w-40 text-yellow-500 opacity-20 animate-pulse" />
          </div>
        </div>
      </main>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            borderRadius: "8px",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#ffffff",
          },
        }}
      />
    </div>
  )
}
