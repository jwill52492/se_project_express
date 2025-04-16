const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '67ff3ca41ab849c5f18eae94'
  };
  next();
});

app.listen(3001, () => {
  console.log(`Listening on port ${PORT}`);
});

