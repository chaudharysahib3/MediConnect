import { useState } from "react";
import axios from "axios";

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    if (!message) return alert("Enter symptoms");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/symptom-check",
        { message }
      );

      setReply(res.data.reply);
    } catch (err) {
      console.log(err);
      alert("AI error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Symptom Checker</h2>

      <input
        type="text"
        placeholder="Enter symptoms (e.g. fever, headache)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={sendMessage}>Check</button>

      <div style={{ marginTop: "20px" }}>
        <b>AI Response:</b>
        <p>{reply}</p>
      </div>
    </div>
  );
};

export default AiChat;