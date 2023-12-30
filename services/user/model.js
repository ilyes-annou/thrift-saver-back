const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type:String,
      required: true,
      default: "USER"
    },
    phoneNumber: {
      type: String,
      required: false
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
    }
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
