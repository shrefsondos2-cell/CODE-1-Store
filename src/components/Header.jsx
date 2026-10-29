import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Header({ cartCount }) {
  const [settings, setSettings] = useState({
    storeName: "CODE 1",
    announcement: "FREE SHIPPING ON ORDERS OVER 2000 EGP",
  });

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from("store_settings")
        .select("store_name, announcement")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Error loading store settings:", error.message);
        return;
      }

      if (mounted && data) {
        setSettings({
          storeName: data.store_name || "CODE 1",
          announcement:
            data.announcement ||
            "FREE SHIPPING ON ORDERS OVER 2000 EGP",
        });
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="announcement-bar">
        {settings.announcement}
      </div>

      <header className="site-header">
        <Link to="/" className="brand-logo">
          {settings.storeName.replace(/\s*1\s*$/, "")}{" "}
          <span>1</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">HOME</Link>
          <a href="/#collection">SHOP</a>
          <a href="/#about">ABOUT</a>
        </nav>

        <Link to="/cart" className="cart-link">
          <span className="cart-icon">🛍</span>
          <span>CART</span>
          <span className="cart-count">{cartCount}</span>
        </Link>
      </header>
    </>
  );
}