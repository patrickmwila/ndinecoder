const mongoose = require('mongoose');

// create a Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

module.exports = mongoose.model('Post', postSchema);