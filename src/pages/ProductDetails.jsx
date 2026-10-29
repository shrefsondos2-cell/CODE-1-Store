import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

export default function ProductDetails({
  addToCart,
  products,
  productsLoading,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (productsLoading) {
    return (
      <main className="message-page">
        <h2>LOADING PRODUCT...</h2>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="message-page">
        <h2>PRODUCT NOT FOUND</h2>
        <Link to="/" className="primary-button">
          BACK TO SHOP
        </Link>
      </main>
    );
  }

  const sizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["One Size"];

  function handleAddToCart() {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  }

  return (
    <main className="details-page">
      <div className="breadcrumbs">
        <Link to="/">HOME</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="details-layout">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-information">
          <p className="section-eyebrow">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="details-price">
            {formatPrice(product.price)}

            {product.oldPrice && (
              <span className="old-price">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="details-divider" />

          <p className="details-description">
            {product.description || "A modern essential from CODE 1."}
          </p>

          <p className="detail-label">COLOR</p>
          <p className="detail-color">{product.color || "Black"}</p>

          <p className="detail-label">SELECT SIZE</p>

          <div className="size-options">
            {sizes.map((size) => (
              <button
                type="button"
                key={size}
                className={
                  selectedSize === size
                    ? "size-button selected"
                    : "size-button"
                }
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <p className="detail-label">QUANTITY</p>

          <div className="quantity-control">
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) => current + 1)
              }
            >
              +
            </button>
          </div>

          <button
            className="primary-button add-to-cart-button"
            onClick={handleAddToCart}
          >
            ADD TO CART — {formatPrice(Number(product.price) * quantity)}
          </button>

          <p className="details-note">
            Select your size before adding this item to your cart.
          </p>
        </div>
      </div>
    </main>
  );
}