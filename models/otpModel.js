import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP expires in 5 minutes
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
