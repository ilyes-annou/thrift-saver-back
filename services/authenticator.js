const jwt= require("jsonwebtoken");
const UserModel= require("./user/model");

const authenticator= async (req, res, next) => {
  console.log("authenticating token")
  const header= req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ error: "Unauthorized: No Token" });
  }
  
  const token = header.split(' ')[1];
  


  try {
    console.log("A")
    
    const decodedToken= jwt.verify(token, process.env.SECRET_KEY || "defaultSecretKey");
    console.log("B");
    const user= await UserModel.findById(decodedToken.userId );
    
    if (!user) {
      throw new Error();
    }

    req.user= {
      userId: user._id,
    };

    next();
  } 
  catch (error) {
    console.error(error)
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports= authenticator;
