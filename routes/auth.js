const express = require('express')
const router = express.Router();
const authController = require("../controllers/authController")
const passport = require('passport')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// user related routes
router.get('/', authController.home);

router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/logout', authController.logout);

router.get('/dashboard', ensureAuth, authController.dashboard)

module.exports = router