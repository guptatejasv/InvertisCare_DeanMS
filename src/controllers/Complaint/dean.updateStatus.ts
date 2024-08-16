import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import { transporter } from "../../helper/nodemailer";
import { Student } from "../../model/student.user";
import { Dean } from "../../model/official.deans";
import Notification from "../../model/student.notificaitons";
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;
    const compId = req.params.id;
    const dean = await Dean.findById(userId);
    const complaint = await Complaint.findById(compId);
    if (complaint) {
      if (!complaint.escalatedToDean) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to access this Compalint.",
        });
      }
      if (complaint.escalatedToDean.toString() !== userId) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to access this Compalint.",
        });
      }
      complaint.status = status;
      await complaint.save();
    }

    const student = await Student.findById(complaint?.studentRefId);
    if (student) {
      if (status == "In progress") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${dean?.name}(Dean of ${dean?.department} Deparment) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      } else if (status == "Resolved") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${dean?.name}(Dean of ${dean?.department} Department) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      } else if (status == "Pending") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${dean?.name}(Dean of ${dean?.department} Department) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      } else if (status == "Closed") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${dean?.name}(Dean of ${dean?.department} Department) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      }
    }
    await Notification.create({
      studentRefId: complaint?.studentRefId.toString(),
      message: `Your Complaint with ${compId} at InvertisCare is updated by ${dean?.name}(Dean of ${dean?.department} Department).`,
      type: "Complaint Update",
    });
    res.status(200).json({
      status: "success",
      updateStatus,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
