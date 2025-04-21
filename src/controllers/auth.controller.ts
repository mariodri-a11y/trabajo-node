import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Local imports
import {
  checkPassword,
  handleValidateEmail,
  handleValidatePassword,
  handleValidateUniqueUser,
  handleValidationErrors,
  handleValidationRol,
} from "../validators/validate";

import { User } from "../models/user";
import { getUserByEmailOrUsername } from "../utils/utils";
import { appInsightsClient } from "../app"; // Importa el cliente inicializado

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

    // Registrar un evento personalizado en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackEvent({
        name: "UserSignupSuccess",
        properties: {
          email,
          username,
          rol,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    console.error("❌ Error en el registro de usuario:", error);

    // Registrar la excepción en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackException({ exception: error });
    }

    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const userFound = await getUserByEmailOrUsername(email, username);

    if (!userFound)
      return res.status(404).json({ message: "User not found" });

    if (await checkPassword(password, res, userFound)) return;

    const token = jwt.sign(
      { id: userFound._id, rol: userFound.rol, username: userFound.username },
      "secretkey",
      {
        expiresIn: 86400, // 24 hours
        algorithm: "HS512",
      }
    );

    // Registrar un evento personalizado en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackEvent({
        name: "UserSigninSuccess",
        properties: {
          username: userFound.username,
          rol: userFound.rol,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.json({ token });
  } catch (error: any) {
    console.error("❌ Error en el inicio de sesión:", error);

    // Registrar la excepción en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackException({ exception: error });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};