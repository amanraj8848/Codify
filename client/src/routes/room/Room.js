import React, { useEffect, useState, useCallback } from "react"
import AceEditor from "react-ace"
import { Toaster, toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { generateColor } from "../../utils"

import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-typescript"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/mode-yaml"
import "ace-builds/src-noconflict/mode-golang"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/mode-css"

import "ace-builds/src-noconflict/keybinding-emacs"
import "ace-builds/src-noconflict/keybinding-vim"

import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/ext-searchbox"

const Room = ({ socket }) => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [fetchedUsers, setFetchedUsers] = useState([])
  const [fetchedCode, setFetchedCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [codeKeybinding, setCodeKeybinding] = useState(undefined)
  const [editorDimensions, setEditorDimensions] = useState({ width: "100%", height: "100%" })

  const languagesAvailable = [
    "javascript",
    "java",
    "c_cpp",
    "python",
    "typescript",
    "golang",
    "yaml",
    "html",
  ]
  const codeKeybindingsAvailable = ["default", "emacs", "vim"]

  const updateEditorDimensions = useCallback(() => {
    const editorContainer = document.getElementById("editor-container")
    if (editorContainer) {
      setEditorDimensions({
        width: `${editorContainer.clientWidth}px`,
        height: `${editorContainer.clientHeight}px`,
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", updateEditorDimensions)
    updateEditorDimensions()

    return () => window.removeEventListener("resize", updateEditorDimensions)
  }, [updateEditorDimensions])

  useEffect(() => {
    const handleUpdatingClientList = ({ userslist }) => {
      setFetchedUsers(userslist)
    }

    const handleLanguageChange = ({ languageUsed }) => {
      setLanguage(languageUsed)
    }

    const handleCodeChange = ({ code }) => {
      setFetchedCode(code)
    }

    const handleNewMemberJoined = ({ username }) => {
      toast(`${username} joined`)
    }

    const handleMemberLeft = ({ username }) => {
      toast(`${username} left`, {
        id: `user-left-${username}`,
      })
    }

    socket.on("updating client list", handleUpdatingClientList)
    socket.on("on language change", handleLanguageChange)
    socket.on("on code change", handleCodeChange)
    socket.on("new member joined", handleNewMemberJoined)
    socket.on("member left", handleMemberLeft)

    const backButtonEventListener = e => {
      const eventStateObj = e.state
      if (!("usr" in eventStateObj) || !("username" in eventStateObj.usr)) {
        socket.disconnect()
      }
    }

    window.addEventListener("popstate", backButtonEventListener)

    return () => {
      socket.off("updating client list", handleUpdatingClientList)
      socket.off("on language change", handleLanguageChange)
      socket.off("on code change", handleCodeChange)
      socket.off("new member joined", handleNewMemberJoined)
      socket.off("member left", handleMemberLeft)
      window.removeEventListener("popstate", backButtonEventListener)
    }
  }, [socket])

  const onChange = newValue => {
    setFetchedCode(newValue)
    socket.emit("update code", { roomId, code: newValue })
    socket.emit("syncing the code", { roomId: roomId })
  }

  const handleLanguageChange = e => {
    setLanguage(e.target.value)
    socket.emit("update language", { roomId, languageUsed: e.target.value })
    socket.emit("syncing the language", { roomId: roomId })
  }

  const handleCodeKeybindingChange = e => {
    setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value)
  }

  const handleLeave = () => {
    socket.disconnect()
    !socket.connected && navigate("/", { replace: true, state: {} })
  }

  const copyToClipboard = text => {
    try {
      navigator.clipboard.writeText(text)
      toast.success("Room ID copied")
    } catch (exp) {
      console.error(exp)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Codify⚡</h2>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium mb-1">
              Language
            </label>
            <select
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              name="language"
              id="language"
              value={language}
              onChange={handleLanguageChange}>
              {languagesAvailable.map(eachLanguage => (
                <option key={eachLanguage} value={eachLanguage}>
                  {eachLanguage}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="codeKeybinding" className="block text-sm font-medium mb-1">
              Keybinding
            </label>
            <select
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              name="codeKeybinding"
              id="codeKeybinding"
              value={codeKeybinding}
              onChange={handleCodeKeybindingChange}>
              {codeKeybindingsAvailable.map(eachKeybinding => (
                <option key={eachKeybinding} value={eachKeybinding}>
                  {eachKeybinding}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-green-400 mb-2 font-semibold">Connected Users</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fetchedUsers.map(each => (
                <div key={each} className="flex items-center space-x-2 bg-gray-700 p-2 rounded">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${generateColor(each)}` }}>
                    {each.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-sm truncate">{each}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            className="w-full py-2 px-4 rounded bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => copyToClipboard(roomId)}>
            Copy Room ID
          </button>
          <button
            className="w-full py-2 px-4 rounded bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500"
            onClick={handleLeave}>
            Leave
          </button>
        </div>
      </div>

      <div id="editor-container" className="flex-1 relative">
        <AceEditor
          placeholder="Write your code here."
          mode={language}
          keyboardHandler={codeKeybinding}
          theme="monokai"
          name="collabEditor"
          value={fetchedCode}
          onChange={onChange}
          fontSize={15}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          enableLiveAutocompletion={true}
          enableBasicAutocompletion={false}
          enableSnippets={false}
          wrapEnabled={true}
          tabSize={2}
          editorProps={{
            $blockScrolling: true,
          }}
          style={editorDimensions}
          className="absolute top-0 right-0 bottom-0 left-0"
        />
      </div>
      <Toaster />
    </div>
  )
}

export default Room
