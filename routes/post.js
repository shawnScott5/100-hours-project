const express = require('express')
const router = express.Router();
const postController = require("../controllers/postController")
const passport = require('passport')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// post related routes
router.get('/create-post', ensureAuth, postController.createScreen)
router.post('/create-post', ensureAuth, postController.createPost)



module.exports = router