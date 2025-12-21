import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = (token) =>
  createClient(
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


// ➕ Add Vital
export const addVital = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userId = req.user.id;
    const { vital_type, value, unit, recorded_at } = req.body;

    const { error } = await supabase.from("vitals").insert({
      user_id: userId,
      vital_type,
      value,
      unit,
      recorded_at,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Vital added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📊 Get Vitals (Trends)
export const getVitals = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userId = req.user.id;
    const { vital_type, from, to } = req.query;

    let query = supabase
      .from("vitals")
      .select("value, unit, recorded_at")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: true });

    if (vital_type) {
      query = query.eq("vital_type", vital_type);
    }

    if (from && to) {
      query = query.gte("recorded_at", from).lte("recorded_at", to);
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
