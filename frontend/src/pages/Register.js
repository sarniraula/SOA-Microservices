import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();

      alert("Registration successful! Please log in.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          type="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="w-full px-4 py-2 mb-6 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
}
