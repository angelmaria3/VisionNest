import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AddVision() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("Login required");
      setLoading(false);
      return;
    }

    // 1️⃣ Insert Vision
    const { data: visionData, error: visionError } = await supabase
      .from("visions")
      .insert({
        user_id: user.id,
        title,
        description,
        completed: false,
      })
      .select()
      .single();

    if (visionError) {
      console.error(visionError);
      alert("Failed to create vision");
      setLoading(false);
      return;
    }

    try {
      // 2️⃣ Call AI
      const res = await fetch("http://localhost:5000/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("AI failed");

      const aiData = await res.json();

      // 3️⃣ Insert Tasks
      if (aiData.tasks?.length > 0) {
        const tasksToInsert = aiData.tasks.map((task) => ({
          title: task,
          vision_id: visionData.id,
          user_id: user.id,
          completed: false,
        }));

        const { error: taskError } = await supabase
          .from("tasks")
          .insert(tasksToInsert);

        if (taskError) {
          console.error(taskError);
        }
      }

    } catch (err) {
      console.error("AI generation failed:", err);
    }

    setLoading(false);
    navigate(`/vision/${visionData.id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Vision</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Vision Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />

          <textarea
            placeholder="Short context about your vision..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Generating AI Plan..." : "Submit Vision"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #2B1A4A, #FFE1D6)",
  },
  card: {
    width: "450px",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  },
  title: {
    marginBottom: "24px",
    textAlign: "center",
    color: "#2B1A4A",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
  },
  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    minHeight: "100px",
    resize: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "999px",
    border: "none",
    background: "#2B1A4A",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
