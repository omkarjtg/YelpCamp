const express = require('express');
const router = express.Router();
const passport = require('passport');
const CatchAsync = require('../utils/CatchAsync');
const { func } = require('joi');
const { storeReturnTo } = require('../middleware');
const { renderRegisterForm, userRegister, renderLoginForm, login, logout } = require('../controllers/users');


router.get('/register', (renderRegisterForm));


router.post('/register', CatchAsync(userRegister));

router.get('/login', renderLoginForm);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (login));

router.get('/logout', (logout));
module.exports = router;