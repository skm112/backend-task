"use strict";

const Mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new Mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  deleted: {
    type: Boolean,
    select: false
  },
}, {
  timestamps: { currentTime: () => new Date().toISOString() },
  versionKey: false
});

UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err1, hash) {
      user.password = hash;
      next();
    });
  });
});


UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};




exports.UserModel = Mongoose.model("User", UserSchema);
