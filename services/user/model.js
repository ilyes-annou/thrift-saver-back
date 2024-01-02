const mongoose= require("mongoose");
const bcrypt= require("bcrypt");

const userSchema= new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
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
    token: {
      type: String,
      required: false
    },
    spendings: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Spending" 
    }]
});

userSchema.pre("save", async function (next) {
    const user= this;
    if(user.isModified("password")) {
      const digest= await bcrypt.hash(user.password, 10);
      user.password= digest;
    }
    next();
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const UserModel= mongoose.model("User", userSchema);

module.exports= UserModel;
