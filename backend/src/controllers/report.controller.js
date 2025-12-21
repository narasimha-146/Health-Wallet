import { createClient } from "@supabase/supabase-js";

export const uploadReport = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // 🔑 Supabase client WITH JWT
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const userId = req.user.id;
    const { report_type, report_date, file_name, file_base64 } = req.body;

    const buffer = Buffer.from(file_base64, "base64");
    const filePath = `${userId}/${Date.now()}-${file_name}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filePath, buffer);

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filePath);

    // Insert DB row (RLS now passes)
    const { error: dbError } = await supabase.from("reports").insert({
      user_id: userId,
      report_type,
      report_date,
      file_url: urlData.publicUrl,
      source: "Web",
    });

    if (dbError) {
      return res.status(403).json({ error: dbError.message });
    }

    res.status(201).json({ message: "Report uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const userId = req.user.id;
    const { report_type, from, to } = req.query;

    let query = supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("report_date", { ascending: false });

    if (report_type) {
      query = query.eq("report_type", report_type);
    }

    if (from && to) {
      query = query.gte("report_date", from).lte("report_date", to);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

