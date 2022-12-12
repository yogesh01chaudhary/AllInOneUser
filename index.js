require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const allRoutes = require("./routes/index");
const cors = require("cors");
app.use(express.json());
app.use("/user",allRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to database successfully"))
  .catch((e) => {
    console.log("Couldn't connected to database", e);
  });
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
