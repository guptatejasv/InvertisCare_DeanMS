import { Request, Response } from "express";
import Comment from "../../model/complaint.comment";
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;
    const commentCheck = await Comment.findById(commentId);
    if (commentCheck?.isDeleted == true) {
      return res.status(400).json({
        status: "fail",
        message: "You can't update this comment. This comment id deleted",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        commentBYDean: comment,
      },
      { new: true }
    );

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
