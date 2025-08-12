const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const auth = require('./middleware/auth');
const bodyParser = require('body-parser');
const Product = require('./models/Product');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://mongo-product:27017/productdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to Product DB"))
  .catch(err => console.error(err));

// CREATE
app.post('/products', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

//Get Product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Product service on ${PORT}`));
