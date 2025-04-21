import { Request, Response } from "express";
import { appInsightsClient } from "../app"; // Importa el cliente inicializado
import { User } from "../models/user";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    // Registrar un evento personalizado en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackEvent({
        name: "GetAllUsersSuccess",
        properties: {
          userCount: users.length,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      console.warn("⚠️ appInsightsClient no está definido. Evento no registrado.");
    }

    return res.status(200).json(users);
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error);

    // Registrar la excepción en Application Insights
    if (appInsightsClient) {
      appInsightsClient.trackException({ exception: error });
    } else {
      console.warn("⚠️ appInsightsClient no está definido. Excepción no registrada.");
    }

    return res.status(500).json({ message: error.message });
  }
};