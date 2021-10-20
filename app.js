require('dotenv').config()
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Mongoose Configuration
mongoose.connect(`mongodb+srv://admin-cos:${process.env.PASSWORD}@cluster0.lumde.mongodb.net/pcat_db?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Document Schemas
const postSchema = {
  title: String,
  content: String,
  imageUrl: String
}
const subscriberSchema = {
  email: String
}
const Post = mongoose.model("Post", postSchema);
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// Express & EJS Configuration
app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.redirect("/posts");
});

app.route("/posts")

  .get(function(req, res) {
    Post.find({}, function(err, foundPosts) {
      if (!err) {
        res.render("index", {
          posts: foundPosts
        });
      }
    });
  })

  .post(function(req, res) {
    const newPost = new Post({
      title: req.body.postTitle,
      content: req.body.postContent,
      imageUrl: req.body.postImgUrl
    });
    newPost.save(function(err) {
      if (!err) {
        res.render("post", {
          post: newPost
        })
      }
    })
  })
;

app.route("/posts/:post")

  .get(function(req, res) {
    const postId = req.params.post;
    Post.findOne({
      _id: postId
    }, function(err, foundPost) {
      res.render("post", {
        post: foundPost
      })
    });
  })

  .put(function(req, res) {
    const filter = {
      _id: req.params.post
    };
    const update = {
      title: req.body.postTitle,
      content: req.body.postContent,
      imageUrl: req.body.postImgUrl
    };
    Post.findOneAndUpdate(filter, update, function(err) {
      if (!err) {
        res.redirect(`/posts/${req.params.post}`);
      } else {
        console.log(err);
      }
    });
  })

  .delete(function(req, res) {
    Post.deleteOne({
      _id: req.params.post
    }, function(err) {
      if (!err) {
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  });

app.route("/post/new")
  .get(function(req, res) {
    res.render("add")
  });

app.route("/posts/:post/edit")
  .get(function(req, res) {
    const postID = req.params.post;
    Post.findOne({
      _id: postID
    }, function(err, foundPost) {
      res.render("edit", {
        post: foundPost
      })
    });
  })
  .post(function(req, res) {
    const filter = {
      _id: req.params.post
    };
    const update = {
      title: req.body.postTitle,
      content: req.body.postContent,
      imageUrl: req.body.postImgUrl
    };

    Post.findOneAndUpdate(filter, update, function(err) {
      if (!err) {
        res.redirect(`/posts/${req.params.post}`);
      } else {
        console.log(err);
      }
    });
  });

app.route("/posts/:post/delete")
  .post(function(req, res) {
    Post.deleteOne({
      _id: req.params.post
    }, function(err) {
      if (!err) {
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  });

app.route("/subscribe")
  .post(function(req, res) {
    const newSubscriber = new Subscriber({
      email: req.body.userEmail
    });
    newSubscriber.save(function(err) {
      if (!err) {
        res.redirect("posts");
      }
    })
  });


app.route("/about")
  .get(function(req, res) {
    res.render("about")
  });

app.route("/contact")
  .get(function(req, res) {
    res.render("contact")
  });


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server is online...");
});
