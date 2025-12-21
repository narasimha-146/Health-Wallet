import express from "express";
import { handleWhatsAppUpload } from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.post("/webhook", handleWhatsAppUpload);

export default router;
