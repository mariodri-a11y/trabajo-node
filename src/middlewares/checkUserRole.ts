import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interfaces/customRequest";

export const checkUserRol = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res

      .status(401)

      .json({ error: "You must login to use this feature" });
  }
  try {
    const user = jwt.verify(token, "secretkey") as jwt.JwtPayload;
    if (user.rol === "anonymous") {
      return res
        .status(403)
        .json({ message: "You must login to use this feature" });
    }
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
