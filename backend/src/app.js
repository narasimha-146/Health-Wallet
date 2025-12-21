import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";
import vitalsRoutes from "./routes/vitals.routes.js";
import shareRoutes from "./routes/share.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/vitals", vitalsRoutes);
app.use("/share", shareRoutes);
app.use("/webhooks/whatsapp", whatsappRoutes);
app.use("/profile", profileRoutes);
app.get("/", (req, res) => {
  res.send("Digital Health Wallet Backend Running 🚀");
});

export default app;












