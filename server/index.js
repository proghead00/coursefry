import express from "express";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";

const csrfProtection = csrf({ cookie: true });

// express app
const app = express();

// db connections
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONN ERR => ", err));

// apply middlewares
// middlewares should always be a function

app.use(cors());
app.use(express.json({ limit: "5mb" })); // json from frontend to backend

app.use(cookieParser());
app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("checking middleware");
//   next(); // continue the code execution
// });

// route
readdirSync("./routes").map(
  (r) =>
    // load routes folder then map thru them (name of the file then: r) and apply as middleware

    app.use("/api", require(`./routes/${r}`))
  // eg. http://localhost:8000/api/register
);

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/.next"));
}
// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server on port ${port}`));
