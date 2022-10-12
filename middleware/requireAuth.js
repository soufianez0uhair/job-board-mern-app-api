require('dotenv').config();
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;
  
    if(!authorization) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'Authorization token is required!'
                  })
    }
  
    const token = authorization.split(' ')[1];
  
    req.userId = await jwt.verify(token, process.env.SECRET);
  
    if(!req.userId) {
      return res
                .status(400)
                .json({
                  status: 'fail',
                  message: 'Invalid token'
                })
    }

    next();
  }

module.exports = {requireAuth}