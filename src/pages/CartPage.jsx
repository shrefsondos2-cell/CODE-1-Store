import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

export default function CartPage({
  cart,
  updateQuantity,
  removeFromCart,
}) {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    shipping_cost: 50,
    free_shipping_limit: 2000,
  });

  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("store_settings")
        .select("shipping_cost, free_shipping_limit")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Settings loading error:", error.message);
      } else if (data) {
        setSettings({
          shipping_cost: Number(data.shipping_cost ?? 50),
          free_shipping_limit: Number(
            data.free_shipping_limit ?? 2000
          ),
        });
      }

      setSettingsLoading(false);
    }

    loadSettings();
  }, []);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shippingCost =
    subtotal === 0 || subtotal >= settings.free_shipping_limit
      ? 0
      : settings.shipping_cost;

  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <main className="message-page">
        <p className="section-eyebrow">YOUR BAG</p>
        <h1>YOUR CART IS EMPTY.</h1>
        <p>Looks like you haven't found your favorites yet.</p>

        <Link to="/" className="primary-button">
          CONTINUE SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="page-heading">
        <p className="section-eyebrow">YOUR SELECTION</p>
        <h1>
          SHOPPING BAG<span>.</span>
        </h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article
              className="cart-item"
              key={`${item.id}-${item.size}`}
            >
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} />
              </Link>

              <div className="cart-item-info">
                <p className="product-category">{item.category}</p>
                <h3>{item.name}</h3>
                <p>Color: {item.color || "—"}</p>
                <p>Size: {item.size}</p>

                <div className="cart-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.size,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.size,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item.id, item.size)
                  }
                >
                  REMOVE
                </button>
              </div>

              <strong>
                {formatPrice(
                  Number(item.price || 0) *
                    Number(item.quantity || 0)
                )}
              </strong>
            </article>
          ))}
        </div>

        <aside className="order-summary">
  <div className="cart-invoice-logo">
    <span>CODE</span> <span className="logo-one">1</span>
  </div>

  <h2>ORDER SUMMARY</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
<div className="summary-row shipping-row">
  <span>Shipping</span>
  <span className="shipping-price">
    {settingsLoading
      ? "Calculating..."
      : shippingCost === 0
      ? "FREE"
      : formatPrice(shippingCost)}
  </span>
</div>

          {!settingsLoading &&
            subtotal < settings.free_shipping_limit && (
              <p className="shipping-notice">
                Add{" "}
                {formatPrice(
                  settings.free_shipping_limit - subtotal
                )}{" "}
                more to get free shipping.
              </p>
            )}

          <div className="summary-total">
            <span>TOTAL</span>
            <span>
              {settingsLoading
                ? "Calculating..."
                : formatPrice(total)}
            </span>
          </div>

          <button
            type="button"
            className="primary-button checkout-button"
            onClick={() => navigate("/checkout")}
          >
            PROCEED TO CHECKOUT ↗
          </button>

          <Link to="/" className="continue-shopping">
            CONTINUE SHOPPING
          </Link>
        </aside>
      </div>
    </main>
  );
}