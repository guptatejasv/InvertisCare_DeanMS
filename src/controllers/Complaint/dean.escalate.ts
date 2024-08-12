import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import Notification from "../../model/student.notificaitons";
import { Dean } from "../../model/official.deans";
import { transporter } from "../../helper/nodemailer";
import { Student } from "../../model/student.user";
export const escalatedTo = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const dean = await Dean.findById(userId);
    const compId = req.params.id;
    const { escalatedTo } = req.body;
    const commentEscalate = await Complaint.findByIdAndUpdate(
      compId,
      {
        escalatedTo,
        status: "Escalated To Chief",
      },
      { new: true }
    );
    await Notification.create({
      studentRefId: commentEscalate?.studentRefId,
      message: `Your complaint with ${compId} id is escalated to Chief`,
      type: "Complaint Update",
    });
    const student = await Student.findById(commentEscalate?.studentRefId);
    if (student) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "InvertisCare: Complaint Status Update",
        text: `Your Complaint with ${compId} at InvertisCare is Escalated to Chief by ${dean?.name}(Dean of ${dean?.department} Department)".\nPlease keep checking your mail for future updates.`,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Complaint Escalated to Chief successfully.",
      commentEscalate,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err || "An error occurred during registration.",
    });
  }
};
