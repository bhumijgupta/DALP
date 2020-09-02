require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  app = express(),
  port = process.env.PORT || 8080,
  noCache = require("nocache"),
  server = require("http").Server(app),
  io = require("socket.io")(server),
  Course = require("./models/Course");
/**
 * Socket Methods
 */
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/socket-functions");

/**
 * Socket Server
 */
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

// //Function for testing
// nsocket.on("s-test", data => {
//     console.log("Server received data ", data);
//     nsp.emit("r-test", data);
//   });

/**
 * Main Server
 */
const dbURI = process.env.dbURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    throw err;
  });
mongoose.set("useFindAndModify", false);
//Configuring the express instance
// Prevent misconfig headers
app.disable("x-powered-by");

// Prevent opening page in frame or iframe to protect from clickjacking
app.use(helmet.frameguard());

// Prevents browser from caching and storing page
app.use(noCache());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable all CORS requests
app.use(cors());

//If executing in test environment then prevent logging
if (process.env.NODE_ENV !== "test") {
  // log HTTP requests
  app.use(morgan("combined"));
}
//Requiring Routes
const readingRoutes = require("./routes/Courses");

//Using Routes
app.use("/api/course", readingRoutes);

//Starting the server
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server running at port ${port}`);
});

//Peer server
// const peerServer = ExpressPeerServer(server, options);
// app.use("/myapp", peerServer);

// peerServer.on("connection", id => {
//   console.log(`Connected : ${id.id}`);
//   //console.log(server._clients);
// });

// peerServer.on("disconnect", id => {
//   console.log(`Disconnected : ${id.id}`);
// });

module.exports = app; // for testing
