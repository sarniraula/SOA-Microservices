import React, { useState } from "react";

export default function CreateProduct() {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3002/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create product");
      }

      alert("Product created successfully!");
      setForm({ name: "", price: "", stock: "" });
      window.location.href = "/products"; // Redirect to products page

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>

        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Product Name"
        />

        <label className="block mb-2 font-semibold">Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Product Price"
        />

        <label className="block mb-2 font-semibold">Stock</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Stock Quantity"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } transition-colors`}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
