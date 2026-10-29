import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./AdminPage.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  async function loadOrders() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function updateOrderStatus(orderId, newStatus) {
    setUpdatingOrder(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("فشل تحديث حالة الطلب: " + error.message);
      setUpdatingOrder(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === orderId
        ? { ...currentOrder, status: newStatus }
        : currentOrder
    );

    setUpdatingOrder(null);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function getStatusLabel(status) {
    const statuses = {
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };

    return statuses[status] || status || "قيد الانتظار";
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-topbar">
        <Link to="/admin" className="admin-brand">
          CODE <span>1</span> <small>ADMIN PANEL</small>
        </Link>

        <Link to="/admin" className="admin-back-link">
          العودة للوحة التحكم
        </Link>
      </div>

      <section className="admin-welcome">
        <div className="admin-welcome-text">
          <p className="admin-eyebrow">CODE 1 / ORDERS</p>

          <h1>
            إدارة الطلبات<span>.</span>
          </h1>

          <p className="admin-welcome-description">
            متابعة طلبات العملاء ومراجعتها.
          </p>
        </div>
      </section>

      <section className="admin-overview">
        <div className="admin-overview-heading">
          <h2>الطلبات ({orders.length})</h2>

          <button onClick={loadOrders} disabled={loading}>
            {loading ? "جارٍ التحديث..." : "تحديث"}
          </button>
        </div>

        {loading && <p>جارٍ تحميل الطلبات...</p>}

        {error && (
          <p style={{ color: "#d00", direction: "ltr" }}>
            حصل خطأ: {error}
          </p>
        )}

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "right",
              minWidth: "850px",
            }}
          >
            <thead>
              <tr style={{ background: "#111", color: "#fff" }}>
                {[
                  "رقم الطلب",
                  "اسم العميل",
                  "رقم الهاتف",
                  "الإجمالي",
                  "حالة الطلب",
                  "التاريخ",
                  "تفاصيل الطلب",
                ].map((title) => (
                  <th
                    key={title}
                    style={{
                      padding: "15px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && !error && orders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "25px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={cellStyle}>
                    {order.order_number || order.id}
                  </td>

                  <td style={cellStyle}>
                    {order.customer_name || "—"}
                  </td>

                  <td style={cellStyle}>
                    {order.customer_phone || "—"}
                  </td>

                  <td style={cellStyle}>
                    {order.total ?? 0} جنيه
                  </td>

                  <td style={cellStyle}>
                    <select
                      value={order.status || "pending"}
                      disabled={updatingOrder === order.id}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                      style={{
                        padding: "8px 10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "#fff",
                        cursor: "pointer",
                        minWidth: "130px",
                      }}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="confirmed">تم التأكيد</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>

                  <td style={cellStyle}>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString(
                          "ar-EG"
                        )
                      : "—"}
                  </td>

                  <td style={cellStyle}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: "9px 14px",
                        background: "#111",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="code1-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="code1-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="code1-order-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="code1-modal-header">
              <div>
                <p className="code1-modal-eyebrow">
                  CODE 1 / ORDER DETAILS
                </p>

                <h2 id="code1-order-modal-title">
                  تفاصيل الطلب<span>.</span>
                </h2>

                <p className="code1-modal-order-number">
                  رقم الطلب: {selectedOrder.order_number || selectedOrder.id}
                </p>
              </div>

              <button
                className="code1-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="إغلاق النافذة"
              >
                ×
              </button>
            </div>

            <div className="code1-modal-body">
              <div className="code1-order-info-grid">
                <div className="code1-info-card">
                  <span>اسم العميل</span>
                  <strong>{selectedOrder.customer_name || "—"}</strong>
                </div>

                <div className="code1-info-card">
                  <span>رقم الهاتف</span>
                  <strong dir="ltr">
                    {selectedOrder.customer_phone || "—"}
                  </strong>
                </div>

                <div className="code1-info-card">
                  <span>تاريخ الطلب</span>
                  <strong>{formatDate(selectedOrder.created_at)}</strong>
                </div>

                <div className="code1-info-card">
                  <span>حالة الطلب</span>
                  <strong
                    className={`code1-status code1-status-${selectedOrder.status || "pending"}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </strong>
                </div>
              </div>

              <div className="code1-order-address">
                <span>عنوان التوصيل</span>
                <p>{selectedOrder.address || "لم يتم تسجيل العنوان"}</p>
              </div>

              <div className="code1-order-items-section">
                <h3>المنتجات المطلوبة</h3>

                {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.length > 0 ? (
                  <div className="code1-order-items">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        className="code1-order-item"
                        key={`${item.id || item.name || "item"}-${index}`}
                      >
                        <div className="code1-order-item-main">
                          <strong>{item.name || "منتج"}</strong>

                          <span>
                            المقاس: {item.size || "غير محدد"}
                          </span>

                          <span>
                            الكمية: {item.quantity ?? 1}
                          </span>
                        </div>

                        <div className="code1-order-item-price">
                          <strong>
                            {(Number(item.price) || 0).toLocaleString("en-US")}{" "}
                            جنيه
                          </strong>

                          <span>
                            الإجمالي:{" "}
                            {(
                              (Number(item.price) || 0) *
                              (Number(item.quantity) || 1)
                            ).toLocaleString("en-US")}{" "}
                            جنيه
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="code1-empty-items">
                    لا توجد تفاصيل للمنتجات في هذا الطلب.
                  </p>
                )}
              </div>

              <div className="code1-order-total">
                <span>إجمالي الطلب</span>

                <strong>
                  {(Number(selectedOrder.total) || 0).toLocaleString("en-US")}{" "}
                  جنيه
                </strong>
              </div>
            </div>

            <div className="code1-modal-footer">
              <button
                className="code1-modal-done"
                onClick={() => setSelectedOrder(null)}
              >
                إغلاق النافذة
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const cellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};