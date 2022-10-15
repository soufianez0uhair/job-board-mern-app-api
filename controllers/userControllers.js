require('dotenv').config();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '7d'})
}

const signUpUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.signup(name, email, password);

        return res
                  .status(200)
                  .json({
                    status: 'success',
                    data: {
                        id: user._id,
                        name,
                        email,
                        token: createToken(user._id)
                    }
                  })
    } catch(err) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: err.message
                  })
    }
}

const logInUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);

        return res
                  .status(200)
                  .json({
                    status: 'success',
                    data: {
                        id: user._id,
                        name: user.name,
                        email,
                        token: createToken(user._id)
                    }
                  })
    } catch(err) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: err.message
                  })
    }
}

const getUserName = async (req, res) => {
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res
              .status(400)
              .json({
                status: 'fail',
                message: 'Invalid Id'
              })
  }

  try {
    const {name} = await User.findById(id);

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                  name
                }
              })
  } catch(err) {
    return res
              .status(400)
              .json({
                status: 'fail',
                message: 'No such user was found!'
              })
  }
}

const updateEmail = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.updateEmail(email, password, req.userId);

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                  _id: user._id,
                  name: user.name,
                  email,
                  token: createToken(user._id)
                }
              })
  } catch(err) {
    return res
              .status(400)
              .json({
                status: 'fail',
                message: err.message
              })
  }

}

const updatePassword = async (req, res) => {
  const {password, newPassword} = req.body;

  try {
    const user = await User.updatePassword(password, newPassword, req.userId);

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  token: createToken(req.userId)
                }
              })
  } catch(err) {
    return res
              .status(400)
              .json({
                status: 'fail',
                message: err.message
              })
  }
}

module.exports = {signUpUser, logInUser, getUserName, updateEmail, updatePassword}