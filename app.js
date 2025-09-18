require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const mainRouter = require("./routes/index");
const { NotFoundError } = require("./utils/errors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB wtwr_db");
  })
  .catch(console.error);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});

app.use(errors());
app.use(errorHandler);
