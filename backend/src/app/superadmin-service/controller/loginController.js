import { superAdmin } from "../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

const superAdminLogin = (req, res) => {
  const { email, password } = req.body;

  const superAdminData = superAdmin.findOne({ where: { email } });
  if (!superAdminData) {
    return res.status(404).json({ message: "Super Admin not found" });
  }
  bcrypt.compare(password, superAdminData.password, (err, isMatch) => {
    if (err) {
      return res.status(500).json({ message: "Error comparing passwords" });
    }
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: superAdminData.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, message: "Login successful" });
  });
};


export default superAdminLogin;