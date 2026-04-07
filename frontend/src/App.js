import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Appointment from "./pages/Appointment";
import VideoCall from "./pages/VideoCall";
import VideoRoom from "./pages/VideoRoom";
import AiChat from "./pages/AiChat";

function App() {
  const isAuth = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Login />}
        />
        <Route path="/chat" element={<Chat />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/video" element={<VideoCall />} />
        <Route path="/video-room/:roomId" element={<VideoRoom />} />
        <Route path="/ai" element={<AiChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//update
