import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const extractedToken = token.split(" ")[1];
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Unauthorized: Invalid token ${error.message}` });
  }
};

const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  } 
  next();
};

const doctorMiddleware = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }
  next();
};

export {
  authMiddleware,
  superAdminMiddleware,
  adminMiddleware,
  userMiddleware,
  doctorMiddleware,
};
