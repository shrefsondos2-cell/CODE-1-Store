import React from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

export default function ProductCard({ product, addToCart }) {
  const sizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["One Size"];

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
      >
        <div className="product-image-wrapper">
          {product.badge && (
            <span className="product-badge">
              {product.badge}
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />

          <span className="view-product">
            VIEW PRODUCT ↗
          </span>
        </div>
      </Link>

      <div className="product-information">
        <p className="product-category">
          {product.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-price-row">
          <span className="product-price">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="old-price">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          className="quick-add-button"
          onClick={() => addToCart(product, sizes[0], 1)}
        >
          + ADD TO CART
        </button>
      </div>
    </article>
  );
}