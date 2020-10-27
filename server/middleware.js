const jwt = require('jsonwebtoken');
const secret = 'parolasegreta';
const withAuth = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Accesso scaduto');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Accesso negato');
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
}
module.exports = withAuth;