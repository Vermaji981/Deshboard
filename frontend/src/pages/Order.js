import React from "react";

function Order() {
  const dummyOrders = [
    { id: "ORD-9821", customer: "Rahul Sharma", items: "Wireless Headphones", total: "$199.99", status: "Completed", date: "2026-09-05" },
    { id: "ORD-9822", customer: "Priya Patel", items: "Smart Watch Ultra", total: "$299.00", status: "Processing", date: "2026-09-06" },
    { id: "ORD-9823", customer: "Amit Kumar", items: "Mechanical Keyboard", total: "$129.50", status: "Shipped", date: "2026-09-06" },
  ];

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Track customer orders and fulfillment status</p>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Purchased Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((ord) => (
                <tr key={ord.id}>
                  <td><strong>{ord.id}</strong></td>
                  <td>{ord.customer}</td>
                  <td>{ord.items}</td>
                  <td className="price-tag">{ord.total}</td>
                  <td>
                    <span className={`badge ${ord.status === 'Completed' ? 'badge-success' : ord.status === 'Shipped' ? 'badge-primary' : 'badge-warning'}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Order;
