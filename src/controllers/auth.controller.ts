import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// local imports

import {
  checkPassword,
  handleValidateEmail,
  handleValidatePassword,
  handleValidateUniqueUser,
  handleValidationErrors,
  handleValidationRol,
} from "../validators/validate";

import { User } from "../models/user";

import {
  getUserByEmailOrUsername,
} from "../utils/utils";

async function registerUser(req: Request, res: Response) {
  const newUser = new User(req.body);
  newUser.password = await bcrypt.hash(newUser.password, 10);
  await newUser.save();

  return res.status(201).json({ message: `${newUser}` });
}

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, rol } = req.body;

  if (handleValidationRol(rol, res)) return;
  if (await handleValidateUniqueUser({ email, username }, res)) return;
  if (handleValidateEmail(email, res)) return;
  if (handleValidatePassword(password, res)) return;

  try {
    await registerUser(req, res);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const userFound = await getUserByEmailOrUsername(
    req.body.email,
    req.body.username
  );

  if (!req.body.password)
    return res.status(400).json({ message: "Password is required" });

  if (!userFound) return res.status(404).json({ message: "User not found" });
  if (await checkPassword(req.body.password, res, userFound)) return;
  const token = jwt.sign(
    { id: userFound._id, rol: userFound.rol, username: userFound.username },
    "secretkey",
    {
      expiresIn: 86400, // 24 hours
      algorithm: "HS512",
    }
  );

  return res.json({ token });
};
