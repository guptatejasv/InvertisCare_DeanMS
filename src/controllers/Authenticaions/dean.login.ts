import { Request, Response } from "express";
import { Dean } from "../../model/official.deans";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Deanlogin = async (req: Request, res: Response) => {
  try {
    const { officialId, password } = req.body;
    if (!officialId || !password) {
      res.status(401).json({
        status: "fail",
        message: "Please enter Official Id and Password both..",
      });
    }
    const user = await Dean.findOne({ DeanId: officialId }).select("+password");

    if (!user || user.isDeleted == true) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET as string;

    const token = sign({ id: user._id }, secret, {
      expiresIn: "90d",
    });
    // localStorage.setItem("authToken", token);
    if (user && isMatch) {
      res.status(200).json({
        status: "success",
        token,
        message: "You are logged in successfully..!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err || "An error occurred during registration.",
    });
  }
};
