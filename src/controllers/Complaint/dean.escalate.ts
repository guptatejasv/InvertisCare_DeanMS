import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import Notification from "../../model/student.notificaitons";
import { Dean } from "../../model/official.deans";
import { transporter } from "../../helper/nodemailer";
import { Student } from "../../model/student.user";
import mongoose from "mongoose";
import { Chief } from "../../model/official.Chief";
import ChiefNotification from "../../model/chief.notifications";
export const escalatedTo = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const dean = await Dean.findById(userId);
    const compId = req.params.id;
    const { escalatedToChief } = req.body;
    if (!mongoose.Types.ObjectId.isValid(escalatedToChief)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Chief ID provided.",
      });
    }
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
      complaint.status = "Escalated To Chief";
      complaint.escalatedToChief = escalatedToChief;
      await complaint.save();
    }
    console.log(complaint);
    await Notification.create({
      studentRefId: complaint?.studentRefId,
      message: `Your complaint with ${compId} id is escalated to Chief`,
      type: "Complaint Update",
    });

    await ChiefNotification.create({
      ChiefId: escalatedToChief,
      message: `A New Complaint with ${compId} is assigned to you.`,
      type: "Complaint Update",
    });
    const chief = await Chief.findById(escalatedToChief);
    if (chief) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: chief.email,
        subject: "InvertisCare: New Complaint Added",
        text: `A new Complaint with ${compId} at InvertisCare is Assigned to you by ${dean?.name}(Head of ${dean?.department} Department). Please check your Profile`,
      });
    }

    const student = await Student.findById(complaint?.studentRefId);
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
      complaint,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
