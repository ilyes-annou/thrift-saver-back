const jwt= require("jsonwebtoken");
const UserModel= require("./user/model");

const authenticator= async (req, res, next) => {
  const token= req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token" });
  }

  try {
    const decodedToken= jwt.verify(token, process.env.SECRET_KEY || "defaultSecretKey");
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
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports= authenticator;
