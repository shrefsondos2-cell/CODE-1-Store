import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import AdminPage from "./admin/AdminPage";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminSettings from "./admin/AdminSettings";
import AdminCustomers from "./admin/AdminCustomers";
import AdminLogin from "./admin/AdminLogin";
import ProtectedAdmin from "./admin/ProtectedAdmin";
import { supabase } from "./supabaseClient";


function formatPrice(price) {
  return `${price.toLocaleString("en-US")} EGP`;
}

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem("code1-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}
// ===============================
// PRODUCT CARD
// ===============================

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
      >
        <div className="product-image-wrapper">
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />

          <span className="view-product">VIEW PRODUCT ↗</span>
        </div>
      </Link>

      <div className="product-information">
        <p className="product-category">{product.category}</p>

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
          onClick={() => addToCart(product, product.sizes[0], 1)}
        >
          + ADD TO CART
        </button>
      </div>
    </article>
  );
}

// ===============================
// CHECKOUT
// ===============================

function AppContent() {
  const [cart, setCart] = useState(getSavedCart);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id");

      if (error) {
        setProductsError(error.message);
        setProductsLoading(false);
        return;
      }

      const formattedProducts = (data || []).map((product) => ({
        ...product,
        oldPrice: product.old_price ?? null,
      }));

      setProducts(formattedProducts);
      setProductsLoading(false);
    }

    loadProducts();
  }, []);
  useEffect(() => {
    localStorage.setItem("code1-cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function addToCart(product, size, quantity) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          color: product.color,
          size,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(id, size, quantity) {
    if (quantity < 1) {
      setCart((currentCart) =>
        currentCart.filter(
          (item) => !(item.id === id && item.size === size)
        )
      );
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }

  function removeFromCart(id, size) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <div className="app">
      <Header cartCount={cartCount} />

      <Routes>
       <Route
  path="/"
  element={
    <Home
      addToCart={addToCart}
      products={products}
      productsLoading={productsLoading}
      productsError={productsError}
    />
  }
/>
        <Route
  path="/product/:id"
  element={
    <ProductDetails
      addToCart={addToCart}
      products={products}
      productsLoading={productsLoading}
    />
  }
/>

        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />
  <Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin"
  element={
    <ProtectedAdmin>
      <AdminPage />
    </ProtectedAdmin>
  }
/>

<Route
  path="/admin/products"
  element={
    <ProtectedAdmin>
      <AdminProducts />
    </ProtectedAdmin>
  }
/>
<Route
  path="/admin/orders"
  element={
    <ProtectedAdmin>
      <AdminOrders />
    </ProtectedAdmin>
  }
/>
<Route
  path="/admin/orders"
  element={
    <ProtectedAdmin>
      <AdminOrders />
    </ProtectedAdmin>
  }
/>
<Route
  path="/admin/customers"
  element={
    <ProtectedAdmin>
      <AdminCustomers />
    </ProtectedAdmin>
  }
/>
         <Route
  path="/admin/settings"
  element={
    <ProtectedAdmin>
      <AdminSettings />
    </ProtectedAdmin>
  }
/>
        <Route
          path="*"
          element={
            <main className="message-page">
              <h1>PAGE NOT FOUND</h1>
              <Link to="/" className="primary-button">
                BACK HOME
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AdminProductsPage() {
return ( <div className="admin-page"> <h1>إدارة منتجات CODE 1</h1> <p>من هنا هنقدر ندير منتجات المتجر الرجالي.</p>


  <Link to="/admin">
    <button>العودة للوحة التحكم</button>
  </Link>
</div>

);
}
