import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orders, setOrders] = useState([]);
  
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user");
  const loggedIn = !!token;

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:3002/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const qtyObj = {};
        data.forEach((p) => (qtyObj[p._id] = 1));
        setQuantities(qtyObj);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Fetch user orders
  useEffect(() => {
    if (!loggedIn || !userId) return;

    fetch(`http://localhost:3003/orders?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [loggedIn, userId, token]);

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + change),
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://localhost:3002/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch(`http://localhost:3003/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!loggedIn) {
      alert("Please login first!");
      return;
    }

    try {
      const quantity = quantities[productId] || 1;

      const res = await fetch("http://localhost:3003/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          userId,
          products: [{ productId, quantity }],
          status: "pending",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add order");
      }

      const data = await res.json();
      alert(`Added ${quantity} ${quantity > 1 ? "items" : "item"} to your order!`);

      // Refresh orders after adding new one
      setOrders((prev) => [...prev, data.order]);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Our Products</h1>
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 px-4">
        <h1 className="text-4xl font-bold text-blue-600">Our Products</h1>
        <button
          onClick={() => navigate("/create-product")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Product
        </button>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user"); // or whatever key you store user info in
          window.location.href = "/login"; // redirect to login page
        }}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>

      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-blue-600 font-bold mt-2">${product.price}</p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() => handleQuantityChange(product._id, -1)}
                >
                  -
                </button>
                <span className="px-4">{quantities[product._id] || 1}</span>
                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() => handleQuantityChange(product._id, 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add {quantities[product._id] || 1} to Cart
              </button>

              {loggedIn && (
                <button
                  onClick={() => handleDelete(product._id)}
                  className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      {loggedIn && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Your Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded shadow-md border border-gray-200"
                >
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <div className="mt-4">
                    <strong>Products:</strong>
                    <ul className="list-disc list-inside">
                      {order.products.map((p) => (
                        <li key={p.productId}>
                          Product Name: {p.productId}, Quantity: {p.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                   <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="mt-2 w-half px-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Order
                </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
