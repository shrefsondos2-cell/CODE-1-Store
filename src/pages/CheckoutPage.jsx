import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function formatPrice(price, currency = "EGP") {
  return `${Number(price || 0).toLocaleString("en-US")} ${currency}`;
}

const defaultSettings = {
  currency: "EGP",
  shipping_cost: 50,
  free_shipping_limit: 2000,
};

export default function CheckoutPage({ cart, clearCart }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("store_settings")
        .select("currency, shipping_cost, free_shipping_limit")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Settings load error:", error);
        setSettingsError(
          "تعذّر تحميل إعدادات الشحن. راجعي الاتصال وحاولي مرة أخرى."
        );
        setSettingsLoading(false);
        return;
      }

      if (data) {
        setSettings({
          currency: data.currency || "EGP",
          shipping_cost: Number(data.shipping_cost ?? 50),
          free_shipping_limit: Number(data.free_shipping_limit ?? 2000),
        });
      }

      setSettingsLoading(false);
    }

    loadSettings();
  }, []);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shippingCost =
    subtotal >= settings.free_shipping_limit
      ? 0
      : settings.shipping_cost;

  const total = subtotal + shippingCost;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/");
      return;
    }

    if (settingsLoading || settingsError) {
      alert("Please wait until shipping settings are loaded.");
      return;
    }

    const orderNumber = `CODE1-${Date.now()}`;

    const addressWithNotes = [
      `${form.city} - ${form.address}`,
      form.notes.trim() ? `Order notes: ${form.notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const order = {
      order_number: orderNumber,
      customer_name: form.name.trim(),
      customer_email: null,
      customer_phone: form.phone.trim(),
      address: addressWithNotes,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
        size: item.size,
        image: item.image,
      })),
      total,
      status: "pending",
    };

    try {
      const { error } = await supabase
        .from("orders")
        .insert([order]);

      if (error) {
        console.error("Order save error:", error);
        alert("Could not save your order. Please try again.");
        return;
      }

      const savedOrder = {
        id: orderNumber,
        customer: form,
        items: cart,
        subtotal,
        shippingCost,
        currency: settings.currency,
        total,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "code1-last-order",
        JSON.stringify(savedOrder)
      );

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  if (cart.length === 0) {
    return (
      <main className="message-page">
        <h1>YOUR CART IS EMPTY.</h1>
        <Link to="/" className="primary-button">
          GO SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="page-heading">
        <p className="section-eyebrow">ALMOST YOURS</p>
        <h1>
          CHECKOUT<span>.</span>
        </h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>DELIVERY INFORMATION</h2>

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
          />

          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter your city"
            autoComplete="address-level2"
            required
          />

          <label htmlFor="address">Full Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, building, apartment..."
            autoComplete="street-address"
            rows="3"
            required
          />

          <label htmlFor="notes">Order Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any extra delivery details"
            rows="2"
          />

          {settingsError && (
            <p role="alert" style={{ color: "#ff7777" }}>
              {settingsError}
            </p>
          )}

          <p className="demo-notice">
            Orders are saved to the CODE 1 database. This is a demo
            checkout and does not process online payments.
          </p>

          <button
            type="submit"
            className="primary-button checkout-button"
            disabled={settingsLoading || Boolean(settingsError)}
          >
            {settingsLoading ? "LOADING SHIPPING..." : "CONFIRM ORDER"}
          </button>
        </form>

        <aside className="order-summary">
          <h2>YOUR ORDER</h2>

          {cart.map((item) => (
            <div
              className="checkout-product"
              key={`${item.id}-${item.size}`}
            >
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>
                  Size: {item.size} · Qty: {item.quantity}
                </p>
                <strong>
                  {formatPrice(
                    Number(item.price || 0) * Number(item.quantity || 0),
                    settings.currency
                  )}
                </strong>
              </div>
            </div>
          ))}

          <div className="summary-total">
            <span>SUBTOTAL</span>
            <span>{formatPrice(subtotal, settings.currency)}</span>
          </div>

          <div className="summary-total">
            <span>SHIPPING</span>
            <span>
              {shippingCost === 0
                ? "FREE"
                : formatPrice(shippingCost, settings.currency)}
            </span>
          </div>

          {subtotal < settings.free_shipping_limit && (
            <p className="demo-notice">
              Add{" "}
              {formatPrice(
                settings.free_shipping_limit - subtotal,
                settings.currency
              )}{" "}
              more to get free shipping.
            </p>
          )}

          <div className="summary-total">
            <strong>TOTAL</strong>
            <strong>{formatPrice(total, settings.currency)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}