import { Request, Response } from "express";

//local imports
import { User } from "../models/user";

export const getAllUsers = async (_req: Request, res: Response) => {

  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
