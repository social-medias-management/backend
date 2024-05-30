require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//database
const connectDB = require("./db/connect");

//middleware
app.use(cookieParser(process.env.JWT_SECRET));

app.use(
  cors({
    origin: [
      "https://3fdb-27-34-65-96.ngrok-free.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

//middleware
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const platFormRouter = require("./routes/platFormRoutes");
const instaRouter = require("./routes/instaRoutes");

const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/platform", platFormRouter);
app.use("/api/v1/insta", instaRouter);

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
