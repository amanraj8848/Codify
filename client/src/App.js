import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import JoinRoom from "./routes/joinRoom/JoinRoom"
import Room from "./routes/room/Room"
import SocketWrapper from "./components/SocketWrapper"
// import "@radix-ui/themes/styles.css"

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <JoinRoom />,
//     },
//     {
//         path: "/room/:roomId",
//         element: <SocketWrapper><Room /></SocketWrapper>
//     }
// ]);

function App() {
  // return <RouterProvider router={router} />
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<JoinRoom />} />
          <Route
            path="/room/:roomId"
            element={
              <SocketWrapper>
                <Room />
              </SocketWrapper>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
