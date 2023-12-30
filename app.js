const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./services/user/controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongoose= require("mongoose");
const port= 3080;

app.use("/", userRoutes);

app.get("/", (req, res) => res.send("thrift-saver-api"));

mongoose.connect('mongodb://127.0.0.1:27017/thrift-saver-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

  
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

    
    
