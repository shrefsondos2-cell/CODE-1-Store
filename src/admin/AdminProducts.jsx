import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminProducts.css";

const emptyProduct = {
  name: "",
  category: "T-Shirts",
  price: "",
  old_price: "",
  image: "",
  description: "",
  color: "",
};

const categories = [
  "Hoodies",
  "T-Shirts",
  "Jackets",
  "Sneakers",
  "Shoes",
  "Bags",
  "Eyewear",
  "Accessories",
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      setError(`تعذر تحميل المنتجات: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyProduct);
    setEditingId(null);
  }

  function startEditing(product) {
    setForm({
      name: product.name || "",
      category: product.category || "T-Shirts",
      price: product.price ?? "",
      old_price: product.old_price ?? "",
      image: product.image || "",
      description: product.description || "",
      color: product.color || "",
    });

    setEditingId(product.id);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const productData = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        old_price:
          form.old_price === "" ? null : Number(form.old_price),
        image: form.image.trim(),
        description: form.description.trim(),
        color: form.color.trim(),
      };

      if (
        !productData.name ||
        !productData.image ||
        !productData.color ||
        !Number.isFinite(productData.price) ||
        productData.price <= 0 ||
        (productData.old_price !== null &&
          (!Number.isFinite(productData.old_price) ||
            productData.old_price <= 0))
      ) {
        setError(
          "راجعي البيانات: الاسم والصورة واللون والسعر مطلوبة، والأسعار يجب أن تكون أكبر من صفر."
        );
        return;
      }

      let result;

      if (editingId !== null) {
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId)
          .select();
      } else {
        result = await supabase
          .from("products")
          .insert([productData])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      if (!result.data || result.data.length === 0) {
        throw new Error(
          "لم يتم تأكيد حفظ المنتج. راجعي صلاحيات قاعدة البيانات."
        );
      }

      setMessage(
        editingId !== null
          ? "تم تعديل المنتج بنجاح ✅"
          : "تمت إضافة المنتج بنجاح ✅"
      );

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(`تعذر حفظ المنتج: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `هل أنتِ متأكدة من حذف المنتج "${product.name}"؟`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "لم يتم حذف المنتج. راجعي صلاحيات الحذف في Supabase."
        );
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      if (editingId === product.id) {
        resetForm();
      }

      setMessage("تم حذف المنتج بنجاح ✅");
    } catch (err) {
      setError(`تعذر حذف المنتج: ${err.message}`);
    }
  }

  return (
    <main className="products-admin">
      <header className="products-admin-header">
        <Link to="/admin" className="products-admin-brand">
          CODE <span>1</span> <small>ADMIN PANEL</small>
        </Link>

        <Link to="/" className="products-store-link">
          زيارة المتجر ↗
        </Link>
      </header>

      <section className="products-admin-intro">
        <p className="products-admin-eyebrow">
          CODE 1 / INVENTORY
        </p>

        <h1>
          إدارة المنتجات<span>.</span>
        </h1>

        <p>
          أضيفي منتجات المتجر الرجالي، وعدّلي بياناتها أو احذفيها.
        </p>

        <div className="products-total">
          <strong>{products.length}</strong>
          <span>منتج في قاعدة البيانات</span>
        </div>
      </section>

      <section className="product-form-section">
        <div className="products-section-heading">
          <h2>{editingId !== null ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>

          {editingId !== null && (
            <button
              type="button"
              className="products-cancel-button"
              onClick={resetForm}
            >
              إلغاء التعديل
            </button>
          )}
        </div>

        <form className="product-admin-form" onSubmit={handleSubmit}>
          <label>
            اسم المنتج *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: Essential Black Hoodie"
              required
            />
          </label>

          <label>
            التصنيف *
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            السعر بالجنيه *
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            السعر القديم (اختياري)
            <input
              name="old_price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.old_price}
              onChange={handleChange}
            />
          </label>

          <label>
            اللون *
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Black"
              required
            />
          </label>

          <label className="product-form-full">
            رابط صورة المنتج *
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </label>

          <label className="product-form-full">
            وصف المنتج
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="اكتبي وصف المنتج..."
            />
          </label>

          <div className="product-form-actions product-form-full">
            <button
              type="submit"
              className="product-save-button"
              disabled={saving}
            >
              {saving
                ? "جارٍ الحفظ..."
                : editingId !== null
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
            </button>
          </div>
        </form>

        {error && (
          <p className="products-feedback products-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="products-feedback products-success" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="products-list-section">
        <div className="products-section-heading">
          <h2>منتجات المتجر</h2>

          <button
            type="button"
            className="products-refresh-button"
            onClick={loadProducts}
            disabled={loading}
          >
            {loading ? "جارٍ التحميل..." : "تحديث القائمة ↻"}
          </button>
        </div>

        {loading ? (
          <p className="products-empty-state">
            جارٍ تحميل المنتجات...
          </p>
        ) : products.length === 0 ? (
          <p className="products-empty-state">
            لا توجد منتجات لعرضها. راجعي رسالة الخطأ بالأعلى إن ظهرت.
          </p>
        ) : (
          <div className="products-admin-list">
            {products.map((product) => (
              <article className="products-admin-item" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="products-admin-image"
                />

                <div className="products-admin-item-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <strong>
                    {Number(product.price).toLocaleString("en-US")} EGP
                  </strong>
                  <small>رقم المنتج: {product.id}</small>
                </div>

                <div className="products-admin-item-actions">
                  <button
                    type="button"
                    onClick={() => startEditing(product)}
                  >
                    تعديل
                  </button>

                  <button
                    type="button"
                    className="products-delete-button"
                    onClick={() => handleDelete(product)}
                  >
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="products-admin-footer">
        <span>CODE 1 © {new Date().getFullYear()}</span>
        <Link to="/admin">العودة للوحة التحكم</Link>
      </footer>
    </main>
  );
}