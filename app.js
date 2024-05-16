require("dotenv").config();

const express = require("express");

const app = express();

//database
const connectDB = require("./db/connect");

//middleware
app.use(express.json()); //middlware -> to access json data in body

//routers
const authRouter = require("./routes/authRoutes");
const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
