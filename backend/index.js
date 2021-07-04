const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinRoutes = require("./routes/pins");
const userRoutes = require("./routes/users");
const app = express();

dotenv.config();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    console.log("MongoDB not Connected");
  });

app.use("/api/pins", pinRoutes);
app.use("/api/users", userRoutes);

const PORT = 8800;
app.listen(PORT, () => {
  console.log("Backend server is running");
});
