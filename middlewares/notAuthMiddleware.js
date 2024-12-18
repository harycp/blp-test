const notAuth = (req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    req.flash("flash_message", "You are already logged in");
    return res.redirect("/books");
  }
  next();
};

module.exports = notAuth;
