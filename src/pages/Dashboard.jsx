import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import logo from "../assets/VisionNest.png";

const QUOTES = [
  "Small steps today become big wins tomorrow 🌱",
  "Pin your dreams. Build them daily ✨",
  "Consistency beats motivation every time.",
  "You’re closer than you think.",
];

export default function Dashboard() {
  const username = localStorage.getItem("username") || "Creator";
  const navigate = useNavigate();
  const [visions, setVisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisions();
  }, []);

  const fetchVisions = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const user = userData.user;

      const { data, error } = await supabase
        .from("visions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error.message);
      } else {
        setVisions(data || []);
      }
    } catch (err) {
      console.log("Unexpected error:", err);
    }

    setLoading(false);
  };

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src={logo} alt="VisionNest" style={styles.logoImg} />
          <h2 style={styles.logoText}>VisionNest</h2>
        </div>
        <div style={styles.user}>Hey {username} 👋</div>
      </header>

      {/* Quote */}
      <section style={styles.quoteBox}>
        <p style={styles.quoteText}>{quote}</p>
      </section>

      {/* Visions */}
      <main style={styles.main}>
        {loading ? (
          <p>Loading visions...</p>
        ) : visions.length === 0 ? (
          <p>No visions yet. Add your first vision 🚀</p>
        ) : (
          <div style={styles.grid}>
            {visions.map((v) => (
              <div
                key={v.id}
                style={styles.visionCard}
                onClick={() => navigate(`/vision/${v.id}`)}
              >
                <h3 style={styles.visionTitle}>{v.title}</h3>
                <p style={styles.openHint}>Tap to open →</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/add-vision")}
        >
          + Add Vision
        </button>

        <button style={styles.secondaryBtn}>
          View Vision Board
        </button>
      </footer>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFE1D6, #E9E3FF)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(43,26,74,0.85)",
    color: "#fff",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  logoImg: { width: 36, height: 36, borderRadius: 8 },
  logoText: { fontSize: "1.4rem", fontWeight: 700 },
  user: { opacity: 0.9 },

  quoteBox: {
    margin: "24px 40px 0",
    padding: "16px 20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.75)",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
  },
  quoteText: {
    fontSize: "1.05rem",
    color: "#2B1A4A",
    fontWeight: 500,
  },

  main: {
    flex: 1,
    padding: "24px 40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  visionCard: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: "22px",
    padding: "22px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
  visionTitle: { color: "#2B1A4A", fontSize: "1.2rem" },
  openHint: { marginTop: 8, color: "#5B3B8C", fontSize: "0.85rem" },

  footer: {
    padding: "16px 40px 28px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
  primaryBtn: {
    padding: "14px 28px",
    borderRadius: "999px",
    border: "none",
    background: "#2B1A4A",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 28px",
    borderRadius: "999px",
    border: "1px solid #2B1A4A",
    background: "#fff",
    color: "#2B1A4A",
    fontWeight: 600,
    cursor: "pointer",
  },
};
