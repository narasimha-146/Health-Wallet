import express from "express";
import { shareReport,getReportsSharedWithMe, getReportsSharedByMe,revokeReportAccess } from "../controllers/share.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/reports/share", authenticate, shareReport);
router.get("/reports/shared-with-me", authenticate, getReportsSharedWithMe);
router.get("/reports/shared-by-me", authenticate, getReportsSharedByMe);
router.delete("/reports/share/:id", authenticate, revokeReportAccess);

export default router;
