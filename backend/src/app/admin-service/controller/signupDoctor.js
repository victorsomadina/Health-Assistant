import { doctor, admin } from "../../index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import nodemailer from "nodemailer";

const signupDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;
    console.log("Received data:", { id, name, email, password });

    // Input validation
    if (!name || !email || !password || !id) {
      return res.status(400).json({
        message: "Missing required fields",
        error: {
          name: !name,
          email: !email,
          password: !password,
          hospitalId: !id,
        },
      });
    }

    // Find hospital
    const hospital = await admin.findOne({
      where: { id },
      attributes: ["id", "hospitalName"],
    });

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
        error: { hospitalId: id },
      });
    }

    // Create doctor with hashed password
    const [newDoctor, created] = await doctor.findOrCreate({
      where: { email },
      defaults: {
        hospitalId: hospital.id,
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    if (!created) {
      return res.status(409).json({
        message: "Doctor already exists",
        error: { email },
      });
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send welcome email (without password)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to weHelp - Your Account Details",
      html: `
        <h2>Welcome to weHelp, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please use the password you provided during registration to log in.</p>
        <p>For security reasons, we recommend changing your password after your first login.</p>
        <br>
        <p>Best regards,<br>Healthcare Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    const { password: _, ...doctorData } = newDoctor.toJSON();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: doctorData,
    });
  } catch (error) {
    console.error("Doctor creation error:", error);
    return res.status(500).json({
      message: "Error creating doctor",
      error: process.env.NODE_ENV === "development" ? error : {},
    });
  }
};

export default signupDoctor;
