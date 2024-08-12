import { Request, Response } from "express";
import Comment from "../../model/complaint.comment";
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;

    await Comment.findByIdAndUpdate(
      commentId,
      {
        isDeleted: true,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Comment is deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
