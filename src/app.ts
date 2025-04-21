import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import * as appInsights from "applicationinsights";
import { connectionString } from "./config";

//local imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

let appInsightsClient: appInsights.TelemetryClient | undefined;

if (connectionString) {
  try {
    appInsights
      .setup(connectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
      .start();

    appInsightsClient = appInsights.defaultClient;
    console.log("✅ Application Insights inicializado correctamente.");
  } catch (error) {
    console.error("❌ Error al inicializar Application Insights:", error);
  }
} else {
  console.warn("⚠️ APPINSIGHTS_CONNECTION_STRING no está definido. Telemetría desactivada.");
}

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api-docs");
});
export { appInsightsClient };
export default app;

