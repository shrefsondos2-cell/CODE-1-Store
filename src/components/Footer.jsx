import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Footer() {
  const [settings, setSettings] = useState({
    storeName: "CODE 1",
    contactPhone: "",
    contactEmail: "",
    storeAddress: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from("store_settings")
        .select(
          "store_name, contact_phone, contact_email, store_address"
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Error loading footer settings:", error.message);
        return;
      }

      if (mounted && data) {
        setSettings({
          storeName: data.store_name || "CODE 1",
          contactPhone: data.contact_phone || "",
          contactEmail: data.contact_email || "",
          storeAddress: data.store_address || "",
        });
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const logoName = settings.storeName.replace(/\s*1\s*$/, "");
  const hasNumberOne = /\s*1\s*$/.test(settings.storeName);

  return (
    <footer className="site-footer" id="about">
      <div className="footer-main">
        <div>
          <Link to="/" className="footer-logo">
            {logoName}
            {hasNumberOne && <span> 1</span>}
          </Link>

          <p className="footer-description">
            Built for everyday life.
            <br />
            Designed for your own style.
          </p>
        </div>

        <div className="footer-column">
          <h4>EXPLORE</h4>
          <Link to="/">Home</Link>
          <a href="/#collection">Shop Collection</a>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        <div className="footer-column">
          <h4>INFORMATION</h4>
          <p>Men's Fashion</p>
          <p>Everyday Essentials</p>
          <p>Streetwear Culture</p>
        </div>

        {(settings.contactPhone ||
          settings.contactEmail ||
          settings.storeAddress) && (
          <div className="footer-column">
            <h4>CONTACT</h4>

            {settings.contactPhone && (
              <p>
                Phone:{" "}
                <a href={`tel:${settings.contactPhone}`}>
                  {settings.contactPhone}
                </a>
              </p>
            )}

            {settings.contactEmail && (
              <p>
                Email:{" "}
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </p>
            )}

            {settings.storeAddress && (
              <p>{settings.storeAddress}</p>
            )}
          </div>
        )}
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {settings.storeName}.
          {" "}All rights reserved.
        </p>

        <p>MADE FOR YOUR EVERYDAY.</p>
      </div>
    </footer>
  );
}