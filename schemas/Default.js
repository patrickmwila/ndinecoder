const mongoose = require('mongoose');

const defaultContent = new mongoose.Schema({
  profile: String,
});

const DefaultContent = mongoose.model('DefaultContent', defaultContent);

const content = new DefaultContent({
  profile:
    "Hi, my name is Patrick. I'm an artistic web developer with good " +
    'knowledge of both front-end and back-end techniques. This is where I ' +
    'document my thoughts and everything I find useful on the internet.',
});

DefaultContent.countDocuments({ __v: 0 }, function (err, count) {
  if (err) {
    console.log(err.message);
  } else {
    if (count === 0) {
      content.save();
    }
  }
});

module.exports = content;
