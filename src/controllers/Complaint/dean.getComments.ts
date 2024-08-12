import { Request, Response } from "express";
import Comment from "../../model/complaint.comment";

export const getComments = async (req: Request, res: Response) => {
  try {
    const compId = req.params.id;
    const comments = await Comment.find({
      complaintId: compId,
      isDeleted: false,
    });
    res.status(200).jsonp({
      status: "success",
      comments,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err || "An error occurred during registration.",
    });
  }
};
