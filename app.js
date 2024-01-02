require('dotenv').config();
const express= require("express");
const cors= require("cors");
const app= express();
const userRoutes= require("./services/user/controller");
const spendingRoutes= require("./services/spending/controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongoose= require("mongoose");
const port= 3080;

app.use("/", userRoutes);
app.use("/", spendingRoutes);

app.get("/", (req,res) => res.send("thrift-saver-api"));

mongoose.connect("mongodb://127.0.0.1:27017/thrift-saver-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error: ", error.message);
});

db.once("open", () => {
    console.log("MongoDB connection Successful");
});

  
app.listen(port, () => {
    console.log("http://localhost:"+port);
});

    
    
