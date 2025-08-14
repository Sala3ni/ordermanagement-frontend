import React, { useState, useEffect } from "react";
import OrdersTable from "./OrdersTable";
import "./index.css";

// Directly set deployed backend URL here
const API_BASE_URL = "https://ordermanagement-backend-j2clqi5cr-saloni-mishras-projects.vercel.app";

function App() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetchOrders = () => {
    fetch(`${API_BASE_URL}/orders?status=${statusFilter}&page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  const handleUpdate = (order) => {
    const updatedName = prompt("Enter new name", order.name);
    const updatedProduct = prompt("Enter new product name", order.productName);
    const updatedPrice = prompt("Enter new price", order.price);

    if (!updatedName || !updatedProduct || !updatedPrice) return;

    fetch(`${API_BASE_URL}/orders/${order._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updatedName,
        productName: updatedProduct,
        price: Number(updatedPrice),
        orderId: order.orderId,
        method: order.method,
        date: order.date,
        status: order.status
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Order updated successfully");
        fetchOrders(); // refresh table without page reload
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  return (
    <div className="container">
      <h1>Orders</h1>
      <div className="tabs">
        {["", "paid", "pending", "cancelled", "refunded"].map(tab => (
          <button
            key={tab}
            className={statusFilter === tab ? "active" : ""}
            onClick={() => { setStatusFilter(tab); setPage(1); }}
          >
            {tab === "" ? "All orders" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <OrdersTable orders={orders} fetchOrders={fetchOrders} handleUpdate={handleUpdate} />

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;
