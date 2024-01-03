const express= require('express');
const jwt= require('jsonwebtoken');
const authenticator= require('../authenticator');
const router= express.Router();
const UserModel= require("./model")
const SpendingModel= require("../spending/model")
const bcrypt= require("bcrypt");



// Get all users
//Only for admin
router.get("/user/", async (req, res) => {
  try {
    const users= await UserModel.find();
    res.json(users);
    console.log("Success");
  } 
  catch(error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

//Get all user's spendings
// Login
router.get("/user/:userId/spending", authenticator, async (req, res) => {
  const userId= req.params.userId;

  try {
    console.log(req.body)
    if (req.user && req.user.userId.toString() === userId) {
      const spendings= await UserModel.findById(userId).populate('spendings');
      res.json(spendings.spendings);
    } 
    else {
      res.status(401).json({ error: "Unauthorized" });
      console.log(req.body)
    }
  } 
  catch(error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get a specific user by ID
//Admin only
router.get("/user/:id", async (req, res) => {
  const userId= req.params.id;
  try {
    const user= await UserModel.findById(userId);
    if (user) {
      res.json(user);
      console.log("Success");
    } 
    else {
      res.status(404).json({ error: "User not found" });
    }
  } 
  catch(error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Create a new user
// Available for user
router.post("/user/", async (req, res) => {
  const receivedUser= req.body;
  console.log("premier fait")
  try {
    const existingUser= await UserModel.findOne({"email":receivedUser.email});
    if(existingUser){
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser= await UserModel.create(receivedUser);
    //await newUser.save();
    res.status(201).json(newUser);
    console.log("Success");

  } 
  catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Login
// Available
router.post("/login", async (req, res) => {
  const { email, password }= req.body;
  try {
    const user= await UserModel.findOne({"email":email});

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "User not found" });
    }

    const token= jwt.sign({ userId: user._id }, process.env.SECRET_KEY || 'defaultSecretKey', { expiresIn: '1h' });
    user.token= token;
    await user.save();

    res.json({ 
      "token":token, 
      "id":user._id, 
    });
    console.log("Success");

  } 
  catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});



// Update a user by ID
// Login
router.put("/user/:id", async (req, res) => {
  const userId= req.params.id;
  const updateUser= req.body;
  try {

    if(updateUser.email){
      const existingUser= await UserModel.findOne({ email: updateUser.email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    const updateFields = {};
    if (updateUser.email) {
      updateFields.email = updateUser.email;
    }
    if (updateUser.password) {
      updateFields.password = await bcrypt.hash(updateUser.password, 10);
    }

    const updatedUser= await UserModel.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
    if (updatedUser) {
      res.json(updatedUser);
      console.log("Success");
    } 
    else {
      res.status(404).json({ error: "User not found" });
    }
  } 
  catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a user by ID
// Admin, but make anothrt one for user self delete
router.delete("/user/:id", async (req, res) => {
  const userId= req.params.id;
  try {
    const deletedUser= await UserModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.json(deletedUser);
      console.log("Success");
    } 
    else {
      res.status(404).json({ error: "User not found" });
    }
  }
  catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports=router;


