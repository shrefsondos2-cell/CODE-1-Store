import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminPage.css";

const defaultSettings = {
  storeName: "CODE 1",
  announcement: "FREE SHIPPING ON ORDERS OVER 2000 EGP",
  currency: "EGP",
  shippingCost: "50",
  freeShippingLimit: "2000",
  contactPhone: "",
  contactEmail: "",
  storeAddress: "",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError("");

      try {
        const { data, error: loadError } = await supabase
          .from("store_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (loadError) throw loadError;

        if (data) {
          setSettings({
            storeName: data.store_name ?? defaultSettings.storeName,
            announcement:
              data.announcement ?? defaultSettings.announcement,
            currency: data.currency ?? defaultSettings.currency,
            shippingCost: String(
              data.shipping_cost ?? defaultSettings.shippingCost
            ),
            freeShippingLimit: String(
              data.free_shipping_limit ??
                defaultSettings.freeShippingLimit
            ),
            contactPhone: data.contact_phone ?? "",
            contactEmail: data.contact_email ?? "",
            storeAddress: data.store_address ?? "",
          });
        }
      } catch (err) {
        setError(
          "تعذر تحميل الإعدادات من قاعدة البيانات. " +
            (err.message || "")
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (Number(settings.shippingCost) < 0 ||
        Number(settings.freeShippingLimit) < 0) {
      setError("قيمة الشحن والحد الأدنى لا يمكن أن تكون سالبة.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const row = {
      id: 1,
      store_name: settings.storeName.trim(),
      announcement: settings.announcement.trim(),
      currency: settings.currency,
      shipping_cost: Number(settings.shippingCost),
      free_shipping_limit: Number(settings.freeShippingLimit),
      contact_phone: settings.contactPhone.trim(),
      contact_email: settings.contactEmail.trim(),
      store_address: settings.storeAddress.trim(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: saveError } = await supabase
        .from("store_settings")
        .upsert(row, { onConflict: "id" });

      if (saveError) throw saveError;

      setMessage("تم حفظ الإعدادات في قاعدة البيانات بنجاح.");
    } catch (err) {
      setError(
        "تعذر حفظ الإعدادات. " + (err.message || "")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="admin-dashboard">
        <p>جارٍ تحميل إعدادات المتجر...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-topbar">
        <Link to="/admin" className="admin-brand">
          CODE <span>1</span>
          <small>ADMIN PANEL</small>
        </Link>

        <Link to="/admin" className="admin-back-link">
          ← العودة للوحة التحكم
        </Link>
      </div>

      <section className="admin-welcome">
        <div className="admin-welcome-text">
          <p className="admin-eyebrow">CODE 1 / SETTINGS</p>

          <h1>
            إعدادات المتجر<span>.</span>
          </h1>

          <p className="admin-welcome-description">
            تحكمي في المعلومات الأساسية لمتجر CODE 1.
          </p>
        </div>

        <div className="admin-welcome-badge">
          <span>CODE</span>
          <strong>01</strong>
          <small>STORE SETTINGS</small>
        </div>
      </section>

      <section className="admin-overview">
        <div className="admin-overview-heading">
          <div>
            <p className="admin-eyebrow">GENERAL</p>
            <h2>المعلومات الأساسية</h2>
          </div>
        </div>

        <form onSubmit={handleSave} className="code1-settings-form">
          <label>
            اسم المتجر
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            رسالة الشريط العلوي
            <input
              type="text"
              name="announcement"
              value={settings.announcement}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            العملة
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
            >
              <option value="EGP">EGP - جنيه مصري</option>
              <option value="USD">USD - دولار أمريكي</option>
              <option value="SAR">SAR - ريال سعودي</option>
            </select>
          </label>

          <label>
            تكلفة الشحن
            <input
              type="number"
              name="shippingCost"
              min="0"
              value={settings.shippingCost}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            الحد الأدنى للشحن المجاني
            <input
              type="number"
              name="freeShippingLimit"
              min="0"
              value={settings.freeShippingLimit}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            رقم تليفون المتجر
            <input
              type="tel"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              placeholder="أضيفي رقم التواصل"
            />
          </label>

          <label>
            البريد الإلكتروني
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </label>

          <label>
            عنوان المتجر
            <input
              type="text"
              name="storeAddress"
              value={settings.storeAddress}
              onChange={handleChange}
              placeholder="أضيفي عنوان المتجر"
            />
          </label>

          <button
            type="submit"
            className="code1-settings-save"
            disabled={saving}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
          </button>

          {message && (
            <p className="code1-settings-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="code1-settings-message" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      <footer className="admin-footer">
        <span>CODE 1 © {new Date().getFullYear()}</span>
        <span>BUILT FOR YOUR EVERYDAY.</span>
      </footer>
    </main>
  );
}