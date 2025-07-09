import { useState } from "react"
import ChatRoom from "./components/ChatRoom"
import CreateRoom from "./components/CreateRoom"
import JoinRoom from "./components/JoinRoom"
import WelcomePage from "./components/WelcomePage"

function App() {
  const [step, setStep] = useState<"Welcome" | "Create" | "Join">("Welcome")

  return (
    <>
      {step == "Welcome" && (
        <WelcomePage
        onCreateRoom={() => setStep("Create")}
        onJoinRoom={() => setStep("Join")}/>
      )}

      {step === "Create" && <CreateRoom/>}
      {step === "Join" && <JoinRoom/>}
    </>
  )
}

export default App
