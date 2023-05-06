const jwt = require('jsonwebtoken')

const accessToRoute = (req,res,next) => {

   const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
        }
      
    try {
          const decoded = jwt.verify(token, 'remmmis');
          req.id = decoded.id;
          next();
        } catch (err) {
          res.status(401).json({ message: 'Invalid token' });
        }
      }

module.exports = {accessToRoute}