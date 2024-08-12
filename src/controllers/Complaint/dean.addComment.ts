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
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const compId = req.params.id;
    const { comment } = req.body;

    const dean = await Dean.findById(userId);
    const complaint = await Complaint.findById(compId);
    if (complaint) {
      const student = await Student.findById(complaint.studentRefId);
      if (student) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Comment Added to Complaint",
          text: `Your Complaint with ${compId} at InvertisCare is added with a comment by ${dean?.name}(Head of Department)".\nPlease login to portal to check..`,
        });
      }
      const comments = await Comment.create({
        DeanId: userId,
        studentRefId: student?._id,
        complaintId: compId,
        commentByHOD: comment,
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
