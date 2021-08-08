const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { ClipboardItemSchema } = require('./ClipboardItem');
// const ClipboardItemSchema = new Schema({
//   content: { type: {}, required: true },
//   type: { type: String, enum: ['text', 'file'], required: true },
// });

const UserSchema = new Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true, minlength: 4 },
  password: { type: String, required: true, minlength: 4 },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Not Valid Email',
    },
  },
  clipboards: {
    type: [ClipboardItemSchema],
    default: [],
  },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.pre('save', function (next) {
  console.log('\n\n-----pre save for user called-----\n\n');
  const user = this;
  if (user.isModified('password')) {
    console.log('password modified, hashing new password');
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.statics.findByUsernamePassword = function (username, password) {
  const User = this; // binds this to the User model
  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject("User doesn't exist"); // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject('Password Incorrect');
        }
      });
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
