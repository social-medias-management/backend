require("dotenv").config();
require("express-async-errors");

const express = require("express");

const app = express();

//database
const connectDB = require("./db/connect");

//middleware
app.use(express.json()); //middlware -> to access json data in body
//middleware
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

//routers
const authRouter = require("./routes/authRoutes");
const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

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
