import { Router } from "express";

// local imports
import { getAllUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);

export default router;
