const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/dashboard");
      return;
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = isLogout;
