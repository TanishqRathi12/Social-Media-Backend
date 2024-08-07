const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};
module.exports = verifyToken
