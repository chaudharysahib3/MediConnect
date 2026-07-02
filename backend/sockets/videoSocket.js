let users = {};

const videoSocket = (io, socket) => {
  console.log("User connected:", socket.id);

  // register user (after login)
  socket.on("register", (userId) => {
    users[userId] = socket.id;
  });

  // call user
  socket.on("callUser", ({ from, to, name, roomId }) => {
    console.log("Incoming call to:", to);
    if (users[to]) {
      io.to(users[to]).emit("incomingCall", {
        from,
        name,
        roomId,
      });
    }
  });

  // accept
  socket.on("acceptCall", ({ to, roomId }) => {
    if (users[to]) {
      io.to(users[to]).emit("callAccepted", { roomId });
    }
  });

  // reject
  socket.on("rejectCall", ({ to }) => {
    if (users[to]) {
      io.to(users[to]).emit("callRejected");
    }
  });

  // end call
  socket.on("endCall", ({ to }) => {
    if (users[to]) {
      io.to(users[to]).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
      }
    }
  });

  socket.on("joinVideo", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("offer", ({ offer, roomId }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ answer, roomId }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
};

export default videoSocket;