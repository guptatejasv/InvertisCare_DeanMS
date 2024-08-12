import { Router } from "express";
import { verify_token } from "../helper/jwtVerify";
import { DeanRegister } from "../controllers/Authenticaions/dean.register";
import { Deanlogin } from "../controllers/Authenticaions/dean.login";
import { getComplaints } from "../controllers/Complaint/dean.getComplaints";
import { reviewComplaint } from "../controllers/Complaint/dean.reviewComplaint";
import { updateStatus } from "../controllers/Complaint/dean.updateStatus";
import { escalatedTo } from "../controllers/Complaint/dean.escalate";
import { addComment } from "../controllers/Complaint/dean.addComment";
import { getComments } from "../controllers/Complaint/dean.getComments";
import { updateComment } from "../controllers/Complaint/dean.updateComment";
import { deleteComment } from "../controllers/Complaint/dean.deleteComment";
import { getNotifications } from "../controllers/Notifications/dean.getNotifications";
import { readNotification } from "../controllers/Notifications/hod.markReadNotification";

const router = Router();
router.post("/auth/dean/register", DeanRegister);
router.post("/auth/dean/login", Deanlogin);
router.get("/dean/getComplaints", verify_token, getComplaints);
router.get("/dean/reviewComplaint/:id", verify_token, reviewComplaint);
router.patch("/dean/updateStatus/:id", verify_token, updateStatus);
router.patch("/dean/escalatedTo/:id", verify_token, escalatedTo);
router.post("/dean/addComment/:id", verify_token, addComment);
router.get("/dean/getComments", verify_token, getComments);
router.patch("/dean/updateComment/:id", verify_token, updateComment);
router.delete("/dean/deleteComment/:id", verify_token, deleteComment);
router.get("/dean/getNotifications", verify_token, getNotifications);
router.patch("/dean/readNotificaion/:id", verify_token, readNotification);
export default router;