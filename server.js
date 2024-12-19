require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const methodOverride = require("method-override");

const app = express();

const MONGO_URI = process.env.MONGO_URI;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));
app.use(flash());

app.use((req, res, next) => {
  res.locals.flash_message = req.flash("flash_message");
  next();
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.render("home");
});

app.use(authRoutes);
app.use(bookRoutes);

app.get("/admin", authMiddleware, (req, res) => {
  res.render("admin", { username: req.user.username });
});

app.listen(8080, () => {
  console.log("Server started on http://localhost:8080");
});
