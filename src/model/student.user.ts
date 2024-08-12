import { Schema, Document, model } from "mongoose";

export interface IAuth extends Document {
  studentId: string;
  email: string;
  password: string;
  phone: string;
  course?: string;
  year?: string;
  name?: string;
  dob?: Date;
  photo?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
}

const AuthSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    course: {
      type: String,
    },
    year: {
      type: String,
    },
    dob: {
      type: Date,
    },
    photo: {
      type: String,
    },
    name: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Student = model<IAuth>("Student", AuthSchema);
