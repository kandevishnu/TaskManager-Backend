import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
  const { name, email, gender, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpCode = generateOTP();

    await OTP.create({ email, otp: otpCode });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: `"Task Manager" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "🚀 Your Task Manager OTP Code",
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
      <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #10b981; margin-bottom: 10px;">🔐 Verify Your Email</h2>
        <p style="text-align: center; color: #374151; font-size: 16px;">
          Welcome to <strong>Personal Task Manager</strong>! <br>
          Enter the OTP below to continue:
        </p>
        <h1 style="text-align: center; color: #111827; font-size: 36px; margin: 20px 0; letter-spacing: 4px;">
          ${otpCode}
        </h1>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="#" style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
            Open Task Manager
          </a>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 15px;">
        &copy; ${new Date().getFullYear()} Personal Task Manager
      </p>
    </div>
  `,
});


    const hashedPassword = await bcrypt.hash(password, 10);

    res.status(200).json({
      message: "OTP sent to email",
      tempUser: {
        name,
        email,
        gender,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, name, gender, password } = req.body;

  try {
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTP.deleteMany({ email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, gender, password });
    await newUser.save();

    res.status(201).json({ message: "OTP verified and user registered!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
