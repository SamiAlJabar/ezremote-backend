var express = require("express");
var morgan = require("morgan");
const bodyParser = require("body-parser");
var path = require("path");
var PORT = process.env.PORT || 3000;

var app = express();
var authRoutes = require("./routes/auth");
var readRoutes = require("./routes/read");
var insertRoutes = require("./routes/inserts");
var updateRoutes = require("./routes/updates");
var deleteRoutes = require("./routes/deletes");
var dbHandler = require("./dbHandler");

// Joining directories into one
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// URL encoded for values in BODY during POST request
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

// Logs all request information and time
app.use(morgan("tiny"));


// Database Connection with MySQL
dbHandler.connectToDatabase();

// Routing
app.use("/ws/auth/", authRoutes);
app.use("/ws/read/", readRoutes);
app.use("/ws/insert/", insertRoutes);
app.use("/ws/update/", updateRoutes);
app.use("/ws/delete/", deleteRoutes);

app.listen(PORT, function() {
  console.log("Server started on port " + PORT + "...");
});

// setInterval(intervalFunc, 1500);
// function intervalFunc() {
//     console.log('Timer yay!');
// }
