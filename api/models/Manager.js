const mongoose = require("mongoose");

managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  department: {
    type: Object,
  },
  image: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: Object,
    default: { id: 1, name: "Gerente" },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notifications: {
    type: Object,
    default: {},
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
