import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const sections = [
    {
      number: "01",
      title: "إدارة المنتجات",
      description: "إضافة المنتجات وتعديل الأسعار والتفاصيل.",
      link: "/admin/products",
      icon: "📦",
      action: "إدارة المنتجات",
    },
    {
      number: "02",
      title: "إدارة الطلبات",
      description: "متابعة طلبات العملاء ومراجعة تفاصيلها.",
      link: "/admin/orders",
      icon: "🛍️",
      action: "عرض الطلبات",
    },
    {
      number: "03",
      title: "إدارة العملاء",
      description: "الوصول إلى بيانات العملاء ومتابعتها.",
      link: "/admin/customers",
      icon: "👥",
      action: "عرض العملاء",
    },
    {
      number: "04",
      title: "إعدادات المتجر",
      description: "إدارة إعدادات متجر CODE 1.",
      link: "/admin/settings",
      icon: "⚙️",
      action: "الإعدادات",
    },
  ];

  async function handleLogout() {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من تسجيل الخروج؟"
    );

    if (!confirmed) return;

    setLoggingOut(true);
    setError("");

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("حصلت مشكلة أثناء تسجيل الخروج. حاولي مرة أخرى.");
      setLoggingOut(false);
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-topbar">
        <Link to="/" className="admin-brand">
          CODE <span>1</span>
          <small>ADMIN PANEL</small>
        </Link>

        <div className="admin-topbar-actions">
          <Link to="/" className="admin-back-link">
            ↗ زيارة المتجر
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-logout-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-welcome">
        <div className="admin-welcome-text">
          <p className="admin-eyebrow">CODE 1 / MANAGEMENT</p>

          <h1>
            لوحة التحكم<span>.</span>
          </h1>

          <p className="admin-welcome-description">
            أهلًا بك في لوحة إدارة المتجر.
            <br />
            من هنا يمكنك الوصول إلى أقسام الإدارة المختلفة.
          </p>
        </div>

        <div className="admin-welcome-badge">
          <span>CODE</span>
          <strong>01</strong>
          <small>MEN'S FASHION</small>
        </div>
      </section>

      <section className="admin-overview">
        <div className="admin-overview-heading">
          <div>
            <p className="admin-eyebrow">WORKSPACE</p>
            <h2>إدارة المتجر</h2>
          </div>

          <span className="admin-status">
            <span className="admin-status-dot"></span>
            لوحة الإدارة
          </span>
        </div>

        <div className="admin-sections">
          {sections.map((section) => (
            <article className="admin-card" key={section.number}>
              <div className="admin-card-top">
                <span className="admin-card-number">
                  {section.number}
                </span>

                <span className="admin-card-icon">
                  {section.icon}
                </span>
              </div>

              <h3>{section.title}</h3>

              <p>{section.description}</p>

              <Link to={section.link} className="admin-card-link">
                {section.action}
                <span>←</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="admin-footer">
        <span>CODE 1 © {new Date().getFullYear()}</span>
        <span>BUILT FOR YOUR EVERYDAY.</span>
      </footer>
    </main>
  );
}