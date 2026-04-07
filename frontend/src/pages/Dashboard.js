import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>MediConnect</h2>

        <button onClick={() => navigate("/chat")}>Chat</button>
        <button onClick={() => navigate("/appointments")}>
          Appointments
        </button>
        <button onClick={() => navigate("/video")}>
          Video Call
        </button>
        <button onClick={() => navigate("/ai")}>
          AI ChatBoat
        </button>

        <button onClick={logout}>Logout</button>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Welcome 👋</h2>
        <p>Select an option from sidebar</p>
      </div>

    </div>
  );
};

export default Dashboard;