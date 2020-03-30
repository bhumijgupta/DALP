const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server);
const port = process.env.S_PORT || 8081;
/**
 * Socket Methods
 */
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/socket-functions");

io.on("connection", socket => {
  socket.on("join-room", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    console.log(`${user.username} joined the ${user.room} room`);
    //Broadcast that a user has joined for active count
    socket.broadcast.to(user.room).emit("student-join", user.username);
  });
  //Function for testing
  socket.on("s-test", data => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-test", data);
  });
  //TRANSCRIPT
  //teacher will keep on sending the text at s-trans
  socket.on("s-trans", data => {
    //student will receive the text at r-trans
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-trans", data);
  });
  //QUIZ
  //teacher will trigger start-quiz at s-quiz
  socket.on("s-quiz", data => {
    //student will receive the quix at r-quiz
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-quiz", data);
  });
  //PDF-LINK
  //teacher will send the pdf link at s-link
  socket.on("s-link", data => {
    //student will receive the link at r-link
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-link", data);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("student-left", user.username);
    }
  });
});
server.listen(port, err => {
  if (err) throw err;
  else console.log(`Server running on port ${port}`);
});

// //Function for testing
// nsocket.on("s-test", data => {
//     console.log("Server received data ", data);
//     nsp.emit("r-test", data);
//   });
