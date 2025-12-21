import { createClient } from "@supabase/supabase-js";
import { sendShareEmail } from "../utils/email.js";

const getSupabaseClient = (token) =>
  createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}` },
      },
    }
  );


// ➕ SHARE A REPORT (WITH EMAIL NOTIFICATION TRIGGER)
export const shareReport = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const ownerId = req.user.id;
    const ownerEmail = req.user.email;

    const {
      report_id,
      shared_with_email,
      permission,
      expires_at,
    } = req.body;

    // Insert access
    const { error } = await supabase.from("report_access").insert({
      report_id,
      owner_id: ownerId,
      shared_with_email,
      permission,
      expires_at,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Fetch report type (for email)
    const { data: report } = await supabase
      .from("reports")
      .select("report_type")
      .eq("id", report_id)
      .single();

    // 🔔 Send Email
    await sendShareEmail({
      to: shared_with_email,
      reportType: report.report_type,
      sharedBy: ownerEmail,
      expiresAt: expires_at,
    });

    res.status(201).json({
      message: "Report shared and email notification sent",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getReportsSharedWithMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userEmail = req.user.email;

    const { data, error } = await supabase
      .from("report_access")
      .select(`
        id,
        permission,
        expires_at,
        reports (
          id,
          report_type,
          file_url
        )
      `)
      .eq("shared_with_email", userEmail);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(
      data.map((r) => ({
        id: r.id,
        report_type: r.reports.report_type,
        file_url: r.reports.file_url,
        permission: r.permission,
        expires_at: r.expires_at,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportsSharedByMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const ownerId = req.user.id;

    const { data, error } = await supabase
      .from("report_access")
      .select(`
        id,
        shared_with_email,
        permission,
        expires_at,
        reports (
          report_type
        )
      `)
      .eq("owner_id", ownerId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(
      data.map((r) => ({
        id: r.id,
        report_type: r.reports.report_type,
        shared_with_email: r.shared_with_email,
        permission: r.permission,
        expires_at: r.expires_at,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const revokeReportAccess = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const ownerId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from("report_access")
      .delete()
      .eq("id", id)
      .eq("owner_id", ownerId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Access revoked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
