import { admin } from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminData = await admin.findOne({ where: { email } });
    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: adminData.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error });
  }
};
export default adminLogin;