// imports
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
const Post = require(__dirname + '/schemas/Post.js');
const Default = require(__dirname + '/schemas/Default.js');

// setup database
mongoose.connect(
  'mongodb+srv://ndinecoder:echoroot@cluster0.sbzga5h.mongodb.net/db_blog'
);

// setup express
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// handle get requests
app.get('/', (req, res) => {
  // home route

  Post.find((err, postArray) => {
    // note postArray is an array of objects
    if (err) {
      console.log(err.message);
    } else {
      res.render('home', { content: Default.profile, post: postArray });
    }
  });
});

// render different pages using express route parameters
app.get('/posts/:pageId', (req, res) => {
  let pageId = req.params.pageId;

  // render the page with respect to id linked to the url
  Post.findById(pageId, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render('post', { title: result.title, content: result.content });
    }
  });
});

app.get('/about', (req, res) => {
  // about route
  res.render('about');
});

app.get('/contact', (req, res) => {
  // contact route
  res.render('contact');
});

app.post('/success', (req, res) => {
  // contact route response
  res.render('success');

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'patrickmwila.org@gmail.com',
      pass: 'ouvbzyylsfjfpqog',
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: 'patrickmwila.org@gmail.com',
    subject: `${req.body.subject} | From: ${req.body.email}`,
    text: req.body.message,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log('mail sent');
    }
  });
});

app.get('/compose', (req, res) => {
  // compose route
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const blogTitle = req.body.blogTitle;
  const blogContent = req.body.blogPost;

  // remember to check that the user is not submitting empty data before saving
  if (!(blogTitle.length === 0 || blogContent.length === 0)) {
    // create a new blog post record and save it to the Post Collection
    const post = new Post({
      title: blogTitle,
      content: blogContent,
    });

    post.save((err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  } else {
    // if user submitted empty data redirect to same page...
    res.redirect('/compose');
  }
});

// start server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
