import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ChatRoom from "./components/ChatRoom"
import CreateRoom from "./components/CreateRoom"
import JoinRoom from "./components/JoinRoom"
import WelcomePage from "./components/WelcomePage"

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element = {<WelcomePage/>}/>
        <Route path="/create" element = {<CreateRoom/>}/>
        <Route path = "/join" element = {<JoinRoom/>}/>
        <Route path = "/chat/:roomId" element = {<ChatRoom/>}/>
      </Routes>
    </Router>
  )
}

export default App
