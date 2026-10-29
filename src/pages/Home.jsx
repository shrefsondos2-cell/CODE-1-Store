import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

function Home({
  addToCart,
  products,
  productsLoading,
  productsError,
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Hoodies",
    "T-Shirts",
    "Jackets",
    "Sneakers",
    "Shoes",
    "Bags",
    "Eyewear",
    "Accessories",
  ];

  const filteredProducts =
  activeCategory === "All"
    ? products
    : products.filter(
        (product) => product.category === activeCategory
      );

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">
            WELCOME TO CODE 1
          </p>

          <h1>
            YOUR STYLE.
            <br />
            YOUR CODE<span>.</span>
          </h1>

          <p className="hero-description">
            Modern essentials for the way you move.
          </p>

          <a href="#collection" className="primary-button">
            EXPLORE COLLECTION ↗
          </a>

          <div className="hero-bottom-label">
            <span>MEN'S ESSENTIALS</span>
            <span>YOUR STYLE. YOUR CODE.</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
          src="https://images.unsplash.com/photo-1761896902115-49793a359daf?auto=format&fit=crop&w=1200&q=85"
            alt="Men's fashion collection"
          />

          <div className="hero-image-label">
            <span>CODE 1 COLLECTION</span>
            <span>01 / EVERYDAY STYLE</span>
          </div>
        </div>

        <span className="hero-side-text">
          DESIGNED FOR YOUR EVERYDAY
        </span>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div>
          <span className="benefit-number">01</span>
          <div>
            <h3>EVERYDAY ESSENTIALS</h3>
            <p>Made for your everyday style.</p>
          </div>
        </div>

        <div>
          <span className="benefit-number">02</span>
          <div>
            <h3>BUILT FOR COMFORT</h3>
            <p>Comfort meets modern design.</p>
          </div>
        </div>

        <div>
          <span className="benefit-number">03</span>
          <div>
            <h3>YOUR OWN CODE</h3>
            <p>Wear what feels like you.</p>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="collection-section" id="collection">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              FIND YOUR NEXT FAVORITE
            </p>

            <h2>
              THE COLLECTION<span>.</span>
            </h2>
          </div>

          <p className="section-description">
            Modern essentials for the way you move.
          </p>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {productsLoading ? (
          <p>Loading products...</p>
        ) : productsError ? (
          <p>{productsError}</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* STATEMENT */}
      <section className="statement-section">
        <p>LESS NOISE. MORE STYLE.</p>
        <h2>BUILT FOR YOUR EVERYDAY.</h2>

        <a href="#collection" className="statement-link">
          EXPLORE THE COLLECTION ↗
        </a>
      </section>
    </main>
  );
}
export default Home;