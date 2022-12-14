const express = require("express");
const app = express();
const dotenv = require("dotenv");
const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");

dotenv.config({
  path: "backend/config/config.env",
});

app.use("/api/messenger", authRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

databaseConnect();

app.get("/", (req, res) => {
  res.send(`Hi, I am from SERVER site on PORT ${PORT}`);
});
