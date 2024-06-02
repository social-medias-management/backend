require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2; //package to store image on cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

//database
const connectDB = require("./db/connect");

//middleware
app.use(cookieParser(process.env.JWT_SECRET));

app.use(
  cors({
    origin: [
      "https://86a5-27-34-65-96.ngrok-free.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//sheduler
const sheduler = require("./sheduler");

//middleware
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const platFormRouter = require("./routes/platFormRoutes");
const instaRouter = require("./routes/instaRoutes");
const sheduleRouter = require("./routes/sheduleRoutes");

const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/platform", platFormRouter);
app.use("/api/v1/insta", instaRouter);
app.use("/api/v1/shedule", sheduleRouter);

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

sheduler();
start();
