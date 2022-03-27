const express = require('express');
const app = express();
const ejs = require('ejs');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session)
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash')
const connectDB = require('./config/database');

require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

connectDB();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: "JavaScript is super cool",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );
app.use(flash());

app.use(function(req, res, next) {
  res.locals.user = req.session.user
  next()
})

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', postRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 5000')
})