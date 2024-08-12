import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import { Dean } from "../../model/official.deans";
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const hod = await Dean.findById(userId);
    if (hod) {
      if (hod.role == "Dean") {
        const complaint = await Complaint.find({
          escalatedTo: userId,
        });
        if (!complaint) {
          return res.status(400).json({
            status: "fail",
            message: "No Complaint does exist.",
          });
        }
        res.status(200).json({
          status: "success",
          results: complaint.length,
          complaint,
        });
      }
    } else {
      res.send("Something went wrong!");
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};