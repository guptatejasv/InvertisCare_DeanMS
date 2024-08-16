import { Request, Response } from "express";
import { Chief } from "../../model/official.Chief";

export const getChief = async (req: Request, res: Response) => {
  try {
    const deans = await Chief.find().select("-ChiefId -dob");
    res.status(200).json({
      status: "success",
      deans,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err || "An error occurred during fetching Deans.",
    });
  }
};
