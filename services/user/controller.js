const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const UserModel = require("./model")


// test users
const users = [
  { id: 1, name: 'John Doe', age: 25 },
  { id: 2, name: 'Jane Doe', age: 30 },
];

// Get all users
router.get('/user/', async (req, res) => {
  try {
    const users= await UserModel.find();
    res.json(users);
    console.log("Success");
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific user by ID
router.get('/user/:id', async (req, res) => {
  const userId= req.params.id;
  try {
    const user= await UserModel.findById(userId);
    if (user) {
      res.json(user);
      console.log("Success");
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
router.post('/user/', async (req, res) => {
  const newUser= req.body;
  try {
    const createdUser = await UserModel.create(newUser);
    res.status(201).json(createdUser);
    console.log("Success");
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a user by ID
router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const updateUser = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateUser, { new: true });
    if (updatedUser) {
      res.json(updatedUser);
      console.log("Success");
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a user by ID
router.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.json(deletedUser);
      console.log("Success");
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports=router;


