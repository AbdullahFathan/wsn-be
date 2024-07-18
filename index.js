const express = require("express");
const sensorRoute = require("./src/routes/sensor.route");

require("dotenv").config();

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get("/check", function (req, res) {
  res.send("Hello u get answer from server");
});

app.use("/api/sensor", sensorRoute);

app.listen(process.env.DB_HOST, () => {
  console.log("Server Running !!!");
});
