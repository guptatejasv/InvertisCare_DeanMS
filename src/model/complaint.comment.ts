import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Interface to represent a complaint document
export interface IComment extends Document {
  complaintId: ObjectId;
  studentRefId: ObjectId;
  HODId?: ObjectId;
  DeanId?: ObjectId;
  ChiedId?: ObjectId;
  commentByHOD?: string;
  commentBYDean?: string;
  commentByChief?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
  isBlockedBy?: ObjectId;
}

// Define the Complaint schema
const ComplaintSchema: Schema = new Schema(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    studentRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    HODId: {
      type: Schema.Types.ObjectId,
    },
    DeanId: {
      type: Schema.Types.ObjectId,
    },
    ChiefId: {
      type: Schema.Types.ObjectId,
    },
    commentBYDean: {
      type: String,
    },
    commentByHOD: {
      type: String,
    },
    commentBYChief: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isBlockedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Export the model and attach the schema to it
const Comment = mongoose.model<IComment>("Comment", ComplaintSchema);
export default Comment;
