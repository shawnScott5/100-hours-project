const postModel = require("../models/Post")

exports.createScreen = function(req, res) {
    res.render('create-post')
}

exports.createPost = function(req, res) {
    try {
        postModel.create({
          title: req.body.title,
          message: req.body.message,
          user: req.user.id
        });
        console.log("Post has been added!");
        res.redirect("/dashboard");
      } catch (err) {
        console.log(err);
      }
}