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

// 👤 Get Profile
export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("name, email, phone")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userId = req.user.id;
    const { name, phone } = req.body;

    const { error } = await supabase
      .from("users")
      .update({ name, phone })
      .eq("id", userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Profile Summary Counts
export const getProfileSummary = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const supabase = getSupabaseClient(token);

    const userId = req.user.id;
    const userEmail = req.user.email;

    const [{ count: reports }, { count: vitals }, { count: shared }] =
      await Promise.all([
        supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("vitals").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("report_access").select("*", { count: "exact", head: true }).eq("shared_with_email", userEmail),
      ]);

    res.json({
      reports,
      vitals,
      shared,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 Change Password
export const changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { newPassword } = req.body;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
