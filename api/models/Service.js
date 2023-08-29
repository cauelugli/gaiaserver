const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  materials: {
    type: Object,
  },
  materialsCost: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
