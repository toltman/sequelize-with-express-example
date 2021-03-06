const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

const routes = require("./routes/index");
const articles = require("./routes/articles");
const comments = require("./routes/comments");

// const SequelizeStore = require("connect-session-sequelize")(session.Store);

// const sequelize = new Sequelize("database", "username", "password", {
//   dialect: "sqlite",
//   storage: "./session.sqlite",
// });

const app = express();

// use sessions
app.use(
  session({
    secret: "My first database app",
    // store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false,
  })
);

// make userID and name available in templates
app.use(function (req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.userName = req.session.userName;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/articles", articles);
app.use("/articles", comments);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
  });
});

module.exports = app;
