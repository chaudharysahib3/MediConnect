import { useState, useEffect } from "react";
import socket from "../socket/socket";
import API from "../services/api";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const userId = localStorage.getItem("userId");
  const role=localStorage.getItem("role");

  // 🔹 Load doctors/users
  useEffect(() => {
    const fetchUsers = async () => {
      let res;
      if(role === "patient"){
        res = await API.get("/users/doctors");
      } else {
          res = await API.get("/users/patients");
      }
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  // 🔹 Load messages
  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      const res = await API.get(`/chat/${selectedUser._id}`);
      setMessages(res.data);
    };

    loadMessages();
  }, [selectedUser]);

  //Socket setup
  useEffect(() => {
    socket.emit("join", userId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [userId]);

  // 🔹 Send message
  const sendMessage = () => {
    if (!text || !selectedUser) return;

    socket.emit("sendMessage", {
      sender: userId,
      receiver: selectedUser._id,
      text,
    });

    setMessages((prev) => [
      ...prev,
      { sender: userId, text },
    ]);

    setText("");
  };

  return (
    <div style={{ display: "flex", padding:"10px", gap:"10px" }}>

      {/* Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
        <h3>{role === "patient" ? "Doctors" : "Patients"}</h3>

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background:
                selectedUser?._id === user._id ? "#ddd" : "",
            }}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {!selectedUser ? (
          <h3 style={{ padding: "20px" }}>
            Select a user to chat
          </h3>
        ) : (
          <>
            {/* Messages */}
            <div style={{ flex: 1, padding: "10px", overflowY: "scroll" }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign:
                      msg.sender === userId ? "right" : "left",
                    margin: "10px 0",
                  }}
                >
                  <span
                    style={{
                      background:
                        msg.sender === userId ? "#3498db" : "#656161",
                      color: "white",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", padding: "10px" }}>
              <input
                style={{ flex: 1,
                  padding:"10px",
                  fontSize:"16px"
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type message..."
              />

              <button 
              style={{
                padding:"10px 20px",
                fontsize:"14px",
                width:"80px"
              }}
              onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Chat;
