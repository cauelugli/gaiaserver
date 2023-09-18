const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  groupingType: {
    type: String,
    required: true,
  },
  sellValue: {
    type: Number,
    required: true,
  },
  buyValue: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;