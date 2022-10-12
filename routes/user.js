const express = require('express');
const { signUpUser, logInUser, getUserName, updateEmail } = require('../controllers/userControllers');
const {requireAuth} = require('../middleware/requireAuth');

const router = express.Router();

router
    .post('/signup', signUpUser)
    .post('/login', logInUser)
    .get('/:id', getUserName)
    .use(requireAuth)
    .patch('/update/email', updateEmail)

module.exports = router