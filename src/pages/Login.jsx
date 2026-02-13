import { useState } from "react";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isSignup ? "Create your VisionNest" : "Welcome back to VisionNest"}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
          />
        )}

        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />

        <button style={styles.button}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={styles.toggle} onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "New here? Create an account"}
        </p>
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
    background: "linear-gradient(135deg, #FFE1D6, #E9E3FF)", // peach → lavender
  },
  card: {
    width: "340px",
    padding: "32px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.85)", // glassy white
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#2B1A4A", // deep plum for contrast with logo
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "999px",
    border: "none",
    background: "#2B1A4A", // deep plum (contrasts peach/lavender + logo)
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  toggle: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#5B3B8C", // soft purple
    cursor: "pointer",
  },
};
