import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try{let {token} = req.cookies;
    if (!token) {   
    return res.status(400).json({ message: "Unauthorized" });
  }
  let verify = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  if(!verify){
    return res.status(400).json({ message: "Unauthorized" });
  }
    req.userId = verify.userId;

  
}catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }}

  export default isAuth;