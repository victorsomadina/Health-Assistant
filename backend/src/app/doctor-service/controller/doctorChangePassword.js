import { doctor } from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const doctorChangePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const foundDoctor = await doctor.findOne({ where: { id } });
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, foundDoctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    foundDoctor.password = hashedNewPassword;
    await foundDoctor.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password", error });
  }
};
export default doctorChangePassword;