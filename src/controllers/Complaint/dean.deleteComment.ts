import { Request, Response } from "express";
import Comment from "../../model/complaint.comment";
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const comment = await Comment.findById(commentId);

    if (comment) {
      if (comment.DeanId) {
        if (comment.DeanId.toString() !== userId) {
          return res.status(203).json({
            status: "fail",
            message: "You are not autherized to delete this Comment",
          });
        }
      }
      if (comment.DeanId) {
        comment.isDeleted = true;
        await comment.save();
      } else {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to delete this Comment",
        });
      }
    }

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
