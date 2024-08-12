import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  studentRefId: string; // ID of the student the notification belongs to
  message: string; // The notification message
  type: string; // Type of notification (e.g., "Complaint Update", "Profile Change")
  read: boolean; // Whether the notification has been read
  createdAt: Date; // When the notification was created
}

const NotificationSchema: Schema = new Schema(
  {
    studentRefId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Complaint Update", "Profile Change", "General"], // You can expand these types as needed
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default Notification;
