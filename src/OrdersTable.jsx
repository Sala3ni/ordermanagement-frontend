import React from "react";
import axios from "axios";
import "./index.css";

function OrdersTable({ orders = [], fetchOrders, handleUpdate }) {
  // Delete order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/orders/${id}`);
        fetchOrders(); // refresh list
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
      }
    }
  };



  if (!orders || orders.length === 0) {
    return (
      <div className="orders-list">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No orders found.
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order, index) => {
        if (!order) return null;
        
        return (
          <div className="order-card" key={order._id || index}>
            <div className="order-left">
              <div className="order-rank">{index + 1}</div>
              <div className="order-info">
                <div className="order-name">{order.name || 'N/A'}</div>
                <div className="order-id">{order.orderId || 'N/A'}</div>
                <div className="product-name">Product: {order.productName || 'N/A'}</div>
              </div>
            </div>

            <div className="order-details">
              <span className={`status ${(order.status || '').toLowerCase()}`}>
                {order.status || 'Unknown'}
              </span>
              <span>{order.date || 'N/A'}</span>
              <span>{order.method || 'N/A'}</span>
              <span className="price">
                ₹{order.price ? order.price.toLocaleString() : '0'}
              </span>
            </div>

            <div className="order-actions">
              <button
                className="update-btn"
                onClick={() => handleUpdate(order)}
              >
                Update
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(order._id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrdersTable;