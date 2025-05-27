import { doctor } from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import nodemailer from "nodemailer";

const signupDoctor = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [newDoctor, created] = await doctor.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    if (created) {
      res
        .status(201)
        .json({ message: "Doctor created successfully", doctor: newDoctor });

        // send login credentials to the doctor via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Welcome to weHelp - account created',
            text: `Hello ${name},\n\nYour account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password.\n\nBest regards,\nHealthcare Team`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent successfully:", info.response);
            }
        });
    } else {
      res.status(409).json({ message: "Doctor already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating doctor", error });
  }
};
export default signupDoctor;
