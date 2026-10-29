import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ADMIN_ID = "f52fe6ca-4cd5-4162-ba36-fbfa195ec09b";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("تعذّر تسجيل الدخول. راجعي الإيميل وكلمة المرور.");
        return;
      }

      if (data.user?.id !== ADMIN_ID) {
        await supabase.auth.signOut();
        setError("هذا الحساب غير مصرح له بدخول لوحة التحكم.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("حصل خطأ أثناء تسجيل الدخول. حاولي مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#1c1c1c",
          padding: "32px",
          borderRadius: "12px",
          boxSizing: "border-box",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          CODE <span style={{ color: "#aaa" }}>1</span>
        </Link>

        <p
          style={{
            color: "#aaa",
            marginTop: "12px",
            fontSize: "12px",
            letterSpacing: "2px",
          }}
        >
          ADMINISTRATION
        </p>

        <h1 style={{ marginTop: "28px", fontSize: "26px" }}>
          تسجيل دخول الأدمن
        </h1>

        <label
          htmlFor="admin-email"
          style={{ display: "block", marginTop: "24px" }}
        >
          البريد الإلكتروني
        </label>

        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
            background: "#fff",
            color: "#111",
            border: "1px solid #555",
            borderRadius: "6px",
          }}
        />

        <label
          htmlFor="admin-password"
          style={{ display: "block", marginTop: "18px" }}
        >
          كلمة المرور
        </label>

        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            boxSizing: "border-box",
            background: "#fff",
            color: "#111",
            border: "1px solid #555",
            borderRadius: "6px",
          }}
        />

        {error && (
          <p style={{ color: "#ff7777", marginTop: "16px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "14px",
            background: "#fff",
            color: "#111",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </main>
  );
}