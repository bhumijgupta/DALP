const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  config = require("config"),
  app = express(),
  port = process.env.PORT || 8080,
  noCache = require("nocache"),
  server = require("http").Server(app);
//Instanciating a peer server
var ExpressPeerServer = require("peer").ExpressPeerServer;
const options = {
  debug: true,
  allow_discovery: true
};
//Use the database uri from the ./config directory
const dbURI = config.dbURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(res => {
    console.log("Database connected successfully.");
  })
  .catch(err => {
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
if (config.util.getEnv("NODE_ENV") !== "test") {
  // log HTTP requests
  app.use(morgan("combined"));
}
//Requiring Routes
const readingRoutes = require("./routes/Courses");

//Using Routes
app.use("/api/course", readingRoutes);

//Starting the server
server.listen(port, err => {
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
