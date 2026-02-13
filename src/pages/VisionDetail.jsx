import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function VisionDetail() {
  const { id } = useParams();
  const [vision, setVision] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchVision();
    fetchTasks();
  }, []);

  const fetchVision = async () => {
    const { data } = await supabase
      .from("visions")
      .select("*")
      .eq("id", id)
      .single();

    setVision(data);
  };

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("vision_id", id)
      .order("created_at", { ascending: true });

    setTasks(data || []);
  };

  /* ---------------- ADD TASK ---------------- */

  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .insert({
        title: newTask,
        vision_id: id,
        user_id: user.id,
        completed: false,
      })
      .select()
      .single();

    // 🔥 update local state instead of refetch
    setTasks((prev) => [...prev, data]);
    setNewTask("");
  };

  /* ---------------- DELETE TASK ---------------- */

  const deleteTask = async (taskId) => {
    await supabase.from("tasks").delete().eq("id", taskId);

    // 🔥 remove locally
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  /* ---------------- TOGGLE TASK ---------------- */

  const toggleTask = async (taskId, currentStatus) => {
  const { error } = await supabase
    .from("tasks")
    .update({ completed: !currentStatus })
    .eq("id", taskId);

  if (error) {
    console.error("Update failed:", error.message);
    return;
  }

  // Update local state only after success
  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? { ...task, completed: !currentStatus }
        : task
    )
  );
};


  /* ---------------- LIMIT TO 7 ---------------- */

  const visibleTasks = tasks.slice(0, 7);

  const completedCount = visibleTasks.filter((t) => t.completed).length;

  const progress =
    visibleTasks.length > 0
      ? Math.round((completedCount / visibleTasks.length) * 100)
      : 0;

  if (!vision) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{vision.title}</h2>
        <p style={styles.description}>{vision.description}</p>

        {/* Progress */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <p style={styles.progressText}>{progress}% Completed</p>
        </div>

        {/* Add Task */}
        <div style={styles.addWrapper}>
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={styles.input}
          />
          <button style={styles.addButton} onClick={addTask}>
            + Add
          </button>
        </div>

        {/* Tasks */}
        <div style={styles.taskContainer}>
          {visibleTasks.map((task) => (
            <div key={task.id} style={styles.taskRow}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task.id, task.completed)
                }
              />

              <input
                type="text"
                value={task.title}
                readOnly
                style={{
                  ...styles.taskInput,
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              />

              <button
                style={styles.deleteButton}
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {tasks.length > 7 && (
          <p style={styles.note}>
            Showing first 7 tasks for focus 🎯
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFE1D6, #E9E3FF)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  card: {
    width: "600px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  title: {
    color: "#2B1A4A",
    marginBottom: 10,
  },
  description: {
    color: "#555",
    marginBottom: 20,
  },
  progressWrapper: {
    marginBottom: 25,
  },
  progressBar: {
    height: 10,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2B1A4A",
    transition: "width 0.3s ease",
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: "#2B1A4A",
  },
  addWrapper: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
  },
  addButton: {
    padding: "12px 20px",
    borderRadius: 999,
    border: "none",
    background: "#2B1A4A",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  taskContainer: {
    marginTop: 10,
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    border: "none",
    background: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
  },
  deleteButton: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  note: {
    marginTop: 15,
    fontSize: 13,
    color: "#666",
  },
};
