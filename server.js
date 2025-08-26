const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors()); 

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ errors: ["Invalid JSON"] });
  }
  next(err);
});

const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");

app.use("/messages", messagesRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Express server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
