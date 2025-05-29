import {doctor} from "../../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundDoctor = await doctor.findOne({ where: { email } });
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      foundDoctor.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: foundDoctor.id, role: "doctor" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        id: foundDoctor.id,
        name: foundDoctor.name,
        email: foundDoctor.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error });
  }
};
export default doctorLogin;
