import express from "express";
import { uploadReport } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getReports } from "../controllers/report.controller.js";

const router = express.Router();
router.get("/", authenticate, getReports);
router.post("/upload", authenticate, uploadReport);


export default router;
