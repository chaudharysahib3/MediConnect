import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoRoom = () => {
  const { roomId } = useParams();

  const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    startCall();

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleICE);

    return () => socket.off();
  }, []);

  // 🎥 Start Call
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.current.srcObject = stream;

    pc.current = new RTCPeerConnection();

    // add tracks
    stream.getTracks().forEach((track) => {
      pc.current.addTrack(track, stream);
    });

    // receive remote
    pc.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    // ICE
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          roomId,
        });
      }
    };

    // join room
    socket.emit("joinVideo", { roomId, userId });

    // 🔥 Only one creates offer
    if (userId < roomId) {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      socket.emit("offer", { offer, roomId });
    }
  };

  //OFFER
  const handleOffer = async (offer) => {
    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    socket.emit("answer", { answer, roomId });
  };

  //ANSWER
  const handleAnswer = async (answer) => {
    if (!pc.current.currentRemoteDescription) {
      await pc.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };

  //ICE
  const handleICE = async (candidate) => {
    try {
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.log(e);
    }
  };

  // END CALL
  const endCall = () => {
    socket.emit("endCall", { roomId });

    if (pc.current) {
      pc.current.close();
    }

    window.close();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Video Room</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <video ref={localVideo} autoPlay muted width="300" />
        <video ref={remoteVideo} autoPlay width="300" />
      </div>

      <br />

      <button
        onClick={endCall}
        style={{
          background: "red",
          color: "#fff",
          padding: "10px",
        }}
      >
        End Call
      </button>
    </div>
  );
};

export default VideoRoom;