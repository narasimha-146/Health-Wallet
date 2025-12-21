import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile,getProfileSummary ,changePassword} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/get", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.get("/summary", authenticate, getProfileSummary);
router.put("/change-password", authenticate, changePassword);


export default router;
