import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import expressOasGenerator from "express-oas-generator";

//local imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api-docs");
});

export default app;
