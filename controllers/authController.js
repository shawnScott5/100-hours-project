const userModel = require("../models/Auth")
const { hashSync } = require('bcrypt')
const passport = require('passport');
const validator = require('validator')
const md5 = require('md5');

exports.home = (req, res) => {
    res.render('login');
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) { req.flash('errors', { msg: 'Invalid username / password' })}
        if (!user) {
            req.flash('errors', { msg: 'Invalid username / password'})
          return res.redirect('/')
        }
        req.logIn(user, (err) => {
          if (err) { return next(err) }
          res.redirect(req.session.returnTo || '/dashboard')
        })
    })(req, res, next)
}

exports.register = (req, res, next) => {
    const validationErrors = []
    if (!validator.isLength(req.body.username, { min: 6 })) validationErrors.push({ msg: 'Username must be at least 8 characters long' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
  
    if (validationErrors.length) {
      req.flash('regErrors', validationErrors)
      return res.redirect('/')
    }

    let user = new userModel({
    username: req.body.username,
    password: hashSync(req.body.password, 10)
    })

    userModel.findOne({$or: [
        {username: req.body.username}
      ]}, (err, existingUser) => {
        if (err) { return next(err) }
        if (existingUser) {
          req.flash('regErrors', { msg: 'Sorry, that username already exists.' })
          return res.redirect('/')
        } else {
            req.flash('regSuccess', { msg: 'Success! Now you can log in!' })

            user.save()
            .then(user => console.log(user))
             return res.redirect('/')
        }
    })
}

exports.dashboard = (req, res) => {
    res.render('home-dashboard.ejs', {
        user: req.user
    })
}

exports.logout = (req, res) => {
    req.logout()
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
}
