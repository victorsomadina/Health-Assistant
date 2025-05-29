import {admin} from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const adminData = await admin.findOne({ where: { email } });
    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    adminData.password = hashedNewPassword;
    await adminData.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password", error });
  }
};
export default changePassword;