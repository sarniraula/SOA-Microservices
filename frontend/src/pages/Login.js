import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // API call to user-service/login
    try {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    // Save JWT token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.user.id); // Store user ID for future requests

    alert("Login successful!");
    window.location.href = "/products"; // Redirect to products page
  } catch (error) {
    console.error(error);
    alert("Login failed. Please check your email and password.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
        />
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}
