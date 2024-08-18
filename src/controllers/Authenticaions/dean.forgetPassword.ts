import { Request, Response } from "express";
import { Dean } from "../../model/official.deans";
import crypto from "crypto";
import { transporter } from "../../helper/nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const dean = await Dean.findOne({
      email: req.body.email,
    });
    if (!dean) {
      return res.status(400).json({
        status: "fail",
        message: "No user found",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    dean.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    dean.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await dean.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/dean/resetPassword/${resetToken}`;
    const message = `Forgot your passsword? Please submit a PATCH request with a new Password to: ${resetURL}.\n If you don't forget the password please ignore this mail! `;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: dean.email,
        subject: "InvertisCare: Forget Password Mail",
        text: message,
      });
      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      dean.passwordResetToken = undefined;
      dean.passwordResetExpires = undefined;
      await dean.save();
      return res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
