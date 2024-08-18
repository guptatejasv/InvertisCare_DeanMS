import { Request, Response } from "express";
import Complaint, { IComplaint } from "../model/official.complaint";
import mongoose from "mongoose";

export const search = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userIdObject = new mongoose.Types.ObjectId(userId);

    let complaintQuery: Record<string, unknown> = {
      escalatedToDean: userIdObject,
    };

    // Search for complaints
    if (
      req.query.complaintId ||
      req.query.status ||
      req.query.subject ||
      req.query.description
    ) {
      const { complaintId, status, subject, description } = req.query;
      if (complaintId) complaintQuery._id = complaintId;
      if (status) complaintQuery.status = { $regex: status, $options: "i" }; // Case-insensitive search
      if (subject) complaintQuery.subject = { $regex: subject, $options: "i" }; // Case-insensitive search
      if (description)
        complaintQuery.description = { $regex: description, $options: "i" }; // Case-insensitive search

      const complaints: IComplaint[] = await Complaint.find(complaintQuery);

      return res.status(200).json({
        status: "success",
        total: complaints.length,
        data: complaints,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
