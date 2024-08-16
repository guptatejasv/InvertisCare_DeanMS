import { Request, Response } from "express";
// import Complaint from "../model/officail.complaint";
// import { transporter } from "../helper/nodemailer";
// import { HOD } from "../model/official.HOD";
// import Comment from "../model/complaint.comment";
// import { Student } from "../model/student.user";
import Complaint from "../../model/official.complaint";
import { transporter } from "../../helper/nodemailer";
import { Dean } from "../../model/official.deans";
import Comment from "../../model/complaint.comment";
import { Student } from "../../model/student.user";
import Notification from "../../model/student.notificaitons";
import HODNotification from "../../model/hod.notifications";
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const compId = req.params.id;
    const { comment } = req.body;

    const dean = await Dean.findById(userId);

    const complaint = await Complaint.findById(compId);

    if (!complaint) {
      return res.status(203).json({
        status: "fail",
        message:
          "No Complaint exist with this Id or you are not autherized to access this complaint.",
      });
    }
    if (complaint) {
      if (complaint.escalatedToDean) {
        if (complaint.escalatedToDean.toString() !== userId) {
          return res.status(203).json({
            status: "fail",
            message: "You are not autherized to access this Compalint.",
          });
        }
      }
      const student = await Student.findById(complaint.studentRefId);
      if (student) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Comment Added to Complaint",
          text: `Your Complaint with ${compId} at InvertisCare is added with a comment by ${dean?.name}(Dean of ${dean?.department} Department)".\nPlease login to portal to check..`,
        });
      }
      await Notification.create({
        studentRefId: complaint?.studentRefId,
        message: `A New Comment is added to the complaint with ${compId} id.`,
        type: "Complaint Update",
      });

      await HODNotification.create({
        HODId: complaint.assignedTo,
        message: `A New Comment is added to the complaint with ${compId} id.`,
        type: "Complaint Update",
      });
      const comments = await Comment.create({
        DeanId: userId,
        studentRefId: student?._id,
        complaintId: compId,
        commentBYDean: comment,
      });
      res.status(200).json({
        status: "success",
        comments,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
