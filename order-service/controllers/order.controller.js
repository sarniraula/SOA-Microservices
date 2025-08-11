const axios = require("axios");
const Order = require("../models/order.model");

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, status } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Missing required fields or invalid products array" });
    }

    // 1. Check if user exists
    const userRes = await axios
      .get(`http://user-service:3001/users/${userId}`)
      .catch(() => null);

    if (!userRes || !userRes.data) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalAmount = 0;
    const productDetails = [];

    // 2. Validate each product & calculate total
    for (const item of products) {
      const { productId, quantity } = item;

      if (!productId || !quantity) {
        return res.status(400).json({ message: "Each product must have productId and quantity" });
      }

      const productRes = await axios
        .get(`http://product-service:3002/products/${productId}`)
        .catch(() => null);

      if (!productRes || !productRes.data) {
        return res.status(404).json({ message: `Product ${productId} not found` });
      }

      const product = productRes.data;

      if (product.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      totalAmount += product.price * quantity;
      productDetails.push({ ...product, quantity });
    }

    // 3. Create order in DB
    const order = new Order({
      userId,
      products: products.map(p => ({ productId: p.productId, quantity: p.quantity })),
      totalAmount,
      status: status || "pending"
    });

    await order.save();

    // 4. Reduce stock for each product
    for (const item of productDetails) {
      await axios.put(`http://product-service:3002/products/${item._id}`, {
        ...item,
        stock: item.stock - item.quantity
      });
    }

    res.status(201).json({ message: "Order created successfully", order });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
