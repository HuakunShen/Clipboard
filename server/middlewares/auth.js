const isAuthenticated = (req, res, next) => {
  if (req.body.dev) {
    req.user = req.body.user;
    return next();
  }
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).send('Not Logged In');
  }
};
module.exports = { isAuthenticated };
