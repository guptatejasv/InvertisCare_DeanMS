import { Request, Response } from "express";
import Comment from "../../model/complaint.comment";
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;
    const commentCheck = await Comment.findById(commentId);
    if (commentCheck?.DeanId) {
      if (commentCheck.DeanId.toString() !== userId) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to update this comment",
        });
      }
    }

    if (commentCheck?.isDeleted == true) {
      return res.status(400).json({
        status: "fail",
        message: "You can't update this comment. This comment id deleted",
      });
    }
    const updatedComment = await Comment.findById(commentId);
    if (updatedComment) {
      if (updatedComment.DeanId) {
        updatedComment.commentBYDean = comment;
        await updatedComment.save();
      } else {
        return res.status(200).json({
          status: "success",
          message: "This comment does not belongs to you.",
        });
      }
    }

    res.status(200).json({
      status: "success",
      updatedComment,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
