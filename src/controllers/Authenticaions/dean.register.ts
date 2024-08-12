import { Request, Response } from "express";
import { Dean } from "../../model/official.deans";
import bcrypt from "bcryptjs";

export const DeanRegister = async (req: Request, res: Response) => {
  try {
    const { officailId, email, password, role, phone, department, name, dob } =
      req.body;

    // Validate input
    if (!officailId || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please fill all required fields.",
      });
    }

    // Validate officaialId length
    if (officailId.length < 10 || officailId.length > 14) {
      return res.status(400).json({
        status: "fail",
        message: "Officail ID must be between 10 and 14 characters long.",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Dean.create({
      DeanId: officailId,
      email,
      password: hashedPassword,
      role,
      phone,
      department,
      name,
      dob,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully.",
      data: {
        user,
      },
    });
  } catch (err) {
    // General error response
    res.status(500).json({
      status: "fail",
      message: err || "Error: An error occurred during registration.",
    });
  }
};
