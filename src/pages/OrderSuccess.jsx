import React from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

export default function OrderSuccess() {
  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem("code1-last-order") || "null"
    );
  } catch {
    order = null;
  }

  return (
    <main className="message-page success-page">
      <div className="success-icon">✓</div>

      <p className="section-eyebrow">CODE 1 · ORDER</p>

      <h1>THANK YOU.</h1>

      <p>Your order has been saved successfully.</p>

      {order && (
        <>
          <p className="order-number">
            Reference: {order.id}
          </p>

          <p className="order-number">
            Total: {formatPrice(order.total)}
          </p>
        </>
      )}

      <Link to="/" className="primary-button">
        BACK TO HOME
      </Link>
    </main>
  );
}