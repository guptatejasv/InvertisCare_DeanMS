import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";

import { Dean } from "../../model/official.deans";
import { Student } from "../../model/student.user";
import Notification from "../../model/student.notificaitons";
import { transporter } from "../../helper/nodemailer";
import { HOD } from "../../model/official.HOD";
import HODNotification from "../../model/hod.notifications";
export const reviewComplaint = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const compId = req.params.id;
    const complaint = await Complaint.findById(compId)
      .populate({ path: "assignedTo", model: HOD })
      .exec();
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
    }
    const dean = await Dean.findById(userId);
    if (!complaint) {
      return res.status(400).json({
        status: "fail",
        message: "Complaint with this id does not exist..",
      });
    }
    if (complaint) {
      const student = await Student.findById(complaint.studentRefId);
      if (student) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Reviewed",
          text: `Your Complaint with ${compId} at InvertisCare is Opened by ${dean?.name}(Dean of ${dean?.department} Department).\nPlease keep checking your mail for future updates.`,
        });
      }
    }
    await HODNotification.create({
      HODId: complaint.assignedTo,
      message: `The Complaint with ${compId} at InvertisCare is Opened by ${dean?.name}(Dean of ${dean?.department} Department)`,
      type: "Complaint Update",
    });
    await Notification.create({
      studentRefId: complaint.studentRefId,
      message: `Your Complaint with ${compId} at InvertisCare is Opened by ${dean?.name}(Dean of ${dean?.department} Department)`,
      type: "Complaint Update",
    });

    res.status(200).json({
      status: "success",
      complaint,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
