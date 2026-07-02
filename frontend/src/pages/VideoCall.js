import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoCall = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  const currentUserId = localStorage.getItem("userId")
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    try {
      let url =
        role === "patient"
          ? "http://localhost:5000/api/users/doctors"
          : "http://localhost:5000/api/users/patients";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.emit("register", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    socket.on("incomingCall", (data) => {
      console.log("Incoming call:", data);
      setIncomingCall(data);
    });

    return () => socket.off("incomingCall");
  }, []);

  useEffect(() => {
    fetchUsers();

    socket.emit("register", userId);

    socket.on("incomingCall", (data) => {
      setIncomingCall(data);
    });

    socket.on("callAccepted", ({ roomId }) => {
      console.log("call asscept:", roomId);
      window.open(`/video-room/${roomId}`, "_blank");
    });

    socket.on("callRejected", () => {
      alert("Call rejected");
    });

    socket.on("callEnded", () => {
      alert("Call ended");
    });

    return () => socket.off();
  }, []);

  // start call
  const startCall = () => {
    if (!selectedUser) return alert("Select user");

    const roomId = `${currentUserId}_${selectedUser._id}`;

    console.log("Calling:", selectedUser.name);

    socket.emit("callUser", {
      from: userId,
      to: selectedUser._id,
      name: name,
      roomId,
    });
  };

  // accept
  const acceptCall = () => {
    socket.emit("acceptCall", {
      to: incomingCall.from,
      roomId: incomingCall.roomId,
    });

    console.log("opening room", incomingCall.roomId);
    window.open(`/video-room/${incomingCall.roomId}`, "_blank");
    setIncomingCall(null);
  };

  // reject
  const rejectCall = () => {
    socket.emit("rejectCall", {
      to: incomingCall.from,
    });

    setIncomingCall(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Video Call</h2>

      {/* incoming */}
      {incomingCall && (
        <div style={{ background: "#eee", padding: "10px" }}>
          <p>{incomingCall.name} is calling...</p>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Reject</button>
        </div>
      )}

      {/* list */}
      <h3>{role === "patient" ? "Doctors" : "Patients"}</h3>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            console.log("Clicked:", user);
            setSelectedUser(user);
          }}
          style={{
            padding: "10px",
            border:
              selectedUser?._id === user._id
                ? "2px solid blue"
                : "1px solid #ccc",
            marginBottom: "5px",
            cursor: "pointer",
          }}
        >
          {user.name}
        </div>
      ))}

      <button onClick={startCall}>Call</button>

      {incomingCall && (
        <div style={{ background: "#eee", padding: "10px", marginTop: "20px" }}>
          <p>{incomingCall.name} is calling...</p>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;