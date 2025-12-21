import express from "express";
import { addVital, getVitals } from "../controllers/vitals.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, addVital);
router.get("/", authenticate, getVitals);

export default router;
