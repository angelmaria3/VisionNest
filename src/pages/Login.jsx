import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // TEMP: simulate successful login/signup
    navigate("/dashboard");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isSignup ? "Create your VisionNest" : "Welcome back"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <input type="text" placeholder="Full Name" style={styles.input} />
          )}

          <input type="email" placeholder="Email" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />

          <button type="submit" style={styles.button}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

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
    background: "linear-gradient(135deg, #2B1A4A, #FFE1D6)",
  },
  card: {
    width: "420px",                 // LARGE BOX
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.92)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  title: {
    marginBottom: "24px",
    color: "#2B1A4A",
    fontSize: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "999px",
    border: "none",
    background: "#2B1A4A",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  toggle: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#5B3B8C",
    cursor: "pointer",
  },
};
