function methodNotAllowed(req, res, next) {
  next({
    status: 405,
    message: `${req.method} method not allowed for ${req.originalUrl}, my dude.`,
  });
}

module.exports = methodNotAllowed;
