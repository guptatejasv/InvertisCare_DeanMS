import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Dean } from "../model/official.deans";
// import Redis from "ioredis";

// const redis = new Redis();
dotenv.config();

const jwt_secret: string = process.env.JWT_SECRET as string;

export const verify_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "Invalid token" });
    }
    // // Check if token is blacklisted
    // const isBlacklisted = await redis.sismember("blacklistedTokens", token);
    // if (isBlacklisted) {
    //   return res
    //     .status(403)
    //     .json({ status: "fail", message: "Token is blacklisted." });
    // }
    const decode = jwt.verify(token, jwt_secret) as JwtPayload;

    if (!decode.id) {
      res.status(400).json({
        status: "fail",
        message: "Token does not contain user id",
      });
    }

    const user = await Dean.findById(decode.id);

    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    console.log("something went wront while verifing the token", error);
    res.status(500).json({ error: error });
  }
};
