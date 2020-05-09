const express = require("express");
const router = express.Router();
const User = require("../models").User;
const mid = require("../middleware");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.redirect("/articles");
});

/* GET register form */
router.get("/register", (req, res) => {
  res.render("register", { title: "Sign Up" });
});

/* POST register from */
router.post("/register", async (req, res, next) => {
  if (
    req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword
  ) {
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error("Passwords do not match.");
      err.status = 400;
      return next(err);
    }

    // create User
    let user;
    try {
      user = await User.create(req.body);
      res.redirect("/articles");
    } catch (err) {
      throw err; // need to catch errors thrown by database
    }
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

/* GET Login page */
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Sign In" });
});

/* POST Login */
router.post("/login", async (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        // Also look up articles?
        // res.render("profile", { name: user.name, email: user.email });
        req.session.userId = user.id;
        return res.redirect("/profile");
      }
    });
  }
});

/* GET logout */
router.get("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

/* GET profile */
router.get("/profile", mid.requiresLogin, async function (req, res, next) {
  try {
    const user = await User.findByPk(req.session.userId);
    res.render("profile", {
      title: "Profile",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
