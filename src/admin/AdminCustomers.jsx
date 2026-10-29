import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./AdminPage.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_phone, customer_email, total, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const customerMap = new Map();

      (data || []).forEach((order) => {
        const name = order.customer_name?.trim() || "عميل بدون اسم";
        const phone = order.customer_phone?.trim() || "";
        const email = order.customer_email?.trim() || "";

        // نستخدم الاسم ورقم الهاتف والبريد معًا
        // حتى لا ندمج أسماء مختلفة في عميل واحد.
        const key = [
          name.toLowerCase(),
          phone,
          email.toLowerCase(),
        ].join("|");

        if (!customerMap.has(key)) {
          customerMap.set(key, {
            key,
            name,
            phone,
            email,
            ordersCount: 0,
            totalSpent: 0,
            lastOrder: order.created_at,
          });
        }

        const customer = customerMap.get(key);

        customer.ordersCount += 1;
        customer.totalSpent += Number(order.total) || 0;

        if (
          order.created_at &&
          (!customer.lastOrder ||
            new Date(order.created_at) > new Date(customer.lastOrder))
        ) {
          customer.lastOrder = order.created_at;
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      setError(err.message || "تعذر تحميل بيانات العملاء.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const searchText = search.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchText) ||
      customer.phone.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText)
    );
  });

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.ordersCount,
    0
  );

  const totalSales = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

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
          <p className="admin-eyebrow">CODE 1 / CUSTOMERS</p>

          <h1>
            إدارة العملاء<span>.</span>
          </h1>

          <p className="admin-welcome-description">
            متابعة بيانات العملاء وطلباتهم ومشترياتهم.
          </p>
        </div>
      </section>

      <section className="admin-overview">
        <div className="admin-overview-heading">
          <h2>ملخص العملاء</h2>

          <button onClick={loadCustomers} disabled={loading}>
            {loading ? "جارٍ التحديث..." : "تحديث البيانات"}
          </button>
        </div>

        <div className="code1-customer-stats">
          <div className="code1-customer-stat">
            <span>إجمالي العملاء</span>
            <strong>{customers.length}</strong>
          </div>

          <div className="code1-customer-stat">
            <span>إجمالي الطلبات</span>
            <strong>{totalOrders}</strong>
          </div>

          <div className="code1-customer-stat">
            <span>إجمالي قيمة الطلبات</span>
            <strong>
              {totalSales.toLocaleString("en-US")} جنيه
            </strong>
          </div>
        </div>

        <div className="code1-customer-search">
          <input
            type="search"
            placeholder="ابحثي باسم العميل أو رقم الهاتف أو البريد الإلكتروني..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading && <p>جارٍ تحميل بيانات العملاء...</p>}

        {error && (
          <p style={{ color: "#d00", direction: "ltr" }}>
            حصل خطأ: {error}
          </p>
        )}

        {!loading && !error && (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table
              style={{
                width: "100%",
                minWidth: "850px",
                borderCollapse: "collapse",
                textAlign: "right",
              }}
            >
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  {[
                    "اسم العميل",
                    "رقم الهاتف",
                    "البريد الإلكتروني",
                    "عدد الطلبات",
                    "إجمالي المشتريات",
                    "آخر طلب",
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
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: "25px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {customers.length === 0
                        ? "لا توجد بيانات عملاء حتى الآن."
                        : "لا توجد نتائج مطابقة للبحث."}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.key}>
                      <td style={customerCellStyle}>
                        {customer.name}
                      </td>

                      <td style={customerCellStyle} dir="ltr">
                        {customer.phone || "—"}
                      </td>

                      <td style={customerCellStyle}>
                        {customer.email || "—"}
                      </td>

                      <td style={customerCellStyle}>
                        {customer.ordersCount}
                      </td>

                      <td style={customerCellStyle}>
                        {customer.totalSpent.toLocaleString("en-US")} جنيه
                      </td>

                      <td style={customerCellStyle}>
                        {customer.lastOrder
                          ? new Date(
                              customer.lastOrder
                            ).toLocaleDateString("ar-EG")
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const customerCellStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};