const express = require("express"),
  app = express(),
  path = require("path"),
  session = require("express-session"),
  time = require("./util/time");
require("dotenv").config();
require("./util/connect_mongodb");

const PORT = process.env.PORT || 5000;
// setup express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 30 * time.one_day,
      httpOnly: true,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const uploadRouter = require("./routes/uploads");
const clipboardRouter = require("./routes/clipboards");
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/clipboards", clipboardRouter);

app.get("/*", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});

// start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}\nHappy Hacking!`);
});
