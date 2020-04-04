const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const mongoose = require("mongoose");
var io = require("socket.io")(server);
const config = require("config");
const port = process.env.S_PORT || 8081;
const Course = require("./models/Course");

/**
 * Socket Methods
 */
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/socket-functions");
//Use the database uri from the ./config directory
const dbURI = config.dbURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    throw err;
  });
mongoose.set("useFindAndModify", false);
// Enabling cors
app.use(cors());

io.on("connection", (socket) => {
  socket.on("join-room", ({ username, room }) => {
    const userList = getRoomUsers(room);
    var teacherFlag = false;
    //Check if room exists
    if (userList.length === 0) {
      teacherFlag = true;
    }
    const user = userJoin(socket.id, username, room, teacherFlag);
    socket.join(user.room);
    console.log(`${user.username} joined the ${user.room} room`);
    //Broadcast that a user has joined for active count
    socket.broadcast.to(user.room).emit("student-join", user.username);
  });
  //Function for testing
  socket.on("s-test", (data) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-test", data);
  });
  socket.on("s-call", () => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-call");
  });
  //TRANSCRIPT

  //teacher will keep on sending the partial text at s-partial
  socket.on("s-partial", (data) => {
    //student will receive the text at r-trans
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-partial", data);
  });

  //teacher will keep on sending the text at s-trans
  socket.on("s-trans", (data) => {
    //student will receive the text at r-trans
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-trans", data);
  });

  //QUIZ
  //teacher will trigger start-quiz at s-quiz
  socket.on("s-quiz", (data) => {
    //student will receive the quiz at r-quiz
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-quiz", data);
  });
  // Student sends back his marks to teacher
  socket.on("r-quiz-submit", (data) => {
    const user = getCurrentUser(socket.id);
    // Reciever will recieve marks on s-quiz-submit
    io.to(user.room).emit("s-quiz-submit", data);
  });
  // SEND IMAGE
  socket.on("s-image", (image) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-image", image);
  });
  //PDF-LINK
  //teacher will send the pdf link at s-link
  socket.on("s-link", (data) => {
    //student will receive the link at r-link
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("r-link", data);
  });
  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    //if user was a teacher
    if (user.teacher) {
      //delete the course from db
      Course.deleteOne({ room: user.room })
        .then((response) => {
          console.log(`Room ${user.room} deleted successfully`);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      io.to(user.room).emit("t-left", user.room);
    }
    if (user) {
      io.to(user.room).emit("student-left", user.username);
    }
  });
});
server.listen(port, (err) => {
  if (err) throw err;
  else console.log(`Server running on port ${port}`);
});

// //Function for testing
// nsocket.on("s-test", data => {
//     console.log("Server received data ", data);
//     nsp.emit("r-test", data);
//   });
