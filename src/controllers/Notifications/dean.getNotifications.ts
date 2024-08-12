import { Request, Response } from "express";
import { Dean } from "../../model/official.deans";
import DeanNotification from "../../model/dean.notifications";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const checkUser = await Dean.findById(userId);
    if (checkUser) {
      if (checkUser.isDeleted == true || checkUser.isBlocked == true) {
        return res.status(400).json({
          status: "fail",
          message:
            "You can not update get notifications, Your account is deleted or block!",
        });
      }
    }
    const notifications = await DeanNotification.find({ DeanId: userId });
    res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};
