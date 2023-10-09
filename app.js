const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/products_DB");
    console.log(`connected`);
  } catch (error) {
    console.log(error);
    console.log(`not connected`);
    process.exit(1);
  }
};

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("products", productSchema);

app.get("/", (req, res) => {
  try {
    res.status(200).send(`<h1>Home routes</h1>`);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
app.post("/product", async (req, res) => {
  try {
    const { title, description, price, rating } = req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      rating,
    });
    const productData = await newProduct.save();

    if (productData) {
      res.status(200).send({
        success: true,
        message: `add all products`,
        data: productData,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/product", async (req, res) => {
  try {

    
             // logical operation
    const { price, rating } = req.query;
    let products;
    if (price && rating) {
      products = await Product.find({
        $and: [{ price: price }, { rating: rating }],
      });
    } else {
      products = await Product.find();
    }
    // const products = await Product.find({$nor:[{price:500},{rating:4}]});
    // const products = await Product.find({$and:[{price:500},{rating:4}]});
    // const products = await Product.find({$or:[{price:500},{rating:5}]});





    if (products) {
      res.status(200).send({
        success: true,
        message: `return all products`,
        data: products,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
app.get("/product/:price", async (req, res) => {
  try {
    const price = req.params.price;
    const products = await Product.find({ price: price });

    if (products) {
      res.status(200).send({
        success: true,
        message: `return all products`,
        data: products,
      });
    } else {
      res.status(404).send({
        success: false,
        message: `404 Not Found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  app,
  connectDB,
};
