import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>MediConnect</h2>
        <p>Welcome Back 👋</p>
      </div>

      {/* CARDS */}
      <div className="dashboard-cards">

        <div className="card" onClick={() => navigate("/chat")}>
          <h3>💬 Chat</h3>
          <p>Real-time messaging with users</p>
        </div>

        <div className="card" onClick={() => navigate("/appointments")}>
          <h3>📅 Appointments</h3>
          <p>Manage doctor bookings</p>
        </div>

        <div className="card" onClick={() => navigate("/video")}>
          <h3>📹 Video Call</h3>
          <p>Connect with video consultation</p>
        </div>

        <div className="card" onClick={() => navigate("/ai")}>
          <h3>🤖 AI Assistant</h3>
          <p>Check symptoms instantly</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;