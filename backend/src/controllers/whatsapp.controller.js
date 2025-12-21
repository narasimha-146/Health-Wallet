import twilio from "twilio";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../config/supabaseAdmin.js";

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Supabase ANON client (ONLY for user lookup)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const handleWhatsAppUpload = async (req, res) => {
  try {
    console.log("Incoming WhatsApp payload:", req.body);

    const from = req.body.From;
    if (!from) return res.sendStatus(200);

    const phone = from.replace("whatsapp:", "").trim();
    const numMedia = Number(req.body.NumMedia || 0);

    // Text-only message
    if (numMedia === 0) {
      await sendReply(
        from,
        "📄 Please send the medical report file (PDF/Image)."
      );
      return res.sendStatus(200);
    }

    // 🔍 User lookup (allowed by RLS policy)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (userError || !user) {
      await sendReply(
        from,
        "❌ Phone number not registered. Please sign up first."
      );
      return res.sendStatus(200);
    }

    // 📥 Download media from Twilio
    const mediaUrl = req.body.MediaUrl0;
    const mediaType = req.body.MediaContentType0;

    const mediaResponse = await axios.get(mediaUrl, {
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(mediaResponse.data);
    const filePath = `${user.id}/whatsapp-${Date.now()}`;

    // ☁️ UPLOAD USING SERVICE ROLE (BYPASS STORAGE RLS)
    const { error: storageError } = await supabaseAdmin.storage
      .from("reports")
      .upload(filePath, buffer, {
        contentType: mediaType,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      await sendReply(from, "❌ Failed to upload report.");
      return res.sendStatus(200);
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("reports")
      .getPublicUrl(filePath);

    // 🧠 INSERT INTO DB (SERVICE ROLE)
    const { error: insertError } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: user.id,
        report_type: req.body.Body || "WhatsApp Upload",
        report_date: new Date(),
        file_url: urlData.publicUrl,
        source: "WhatsApp",
      });

    if (insertError) {
      console.error("DB insert error:", insertError);
      await sendReply(from, "❌ Failed to save report.");
      return res.sendStatus(200);
    }

    await sendReply(from, "✅ Report uploaded successfully!");
    res.sendStatus(200);
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
    res.sendStatus(500);
  }
};

const sendReply = async (to, message) => {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to,
    body: message,
  });
};
