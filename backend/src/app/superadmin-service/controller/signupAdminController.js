import { admin } from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import nodemailer from "nodemailer";

const signupAdmin = async (req, res) => {
  const { email, hospitalName, password, location } = req.body;
  try {
    const [adminData, created] = await admin.findOrCreate({
      where: { email },
      defaults: {
        email,
        hospitalName,
        location,
        password: await bcrypt.hash(password, 10),
      },
    });
    if (created) {
      // Send login credentials to the admin via email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to weHelp - Admin Account Created",
        text: `Hello,\n\nYour admin account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password.\n\nBest regards,\nHealthcare Team`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
      res
        .status(201)
        .json({ message: "Admin created successfully", admin: adminData });
    } else {
      res.status(409).json({ message: "Admin already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

export default signupAdmin;
