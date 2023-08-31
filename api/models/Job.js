const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

jobSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  worker: {
    type: Object,
    required: true,
  },
  manager: {
    type: Object,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  service: {
    type: Object,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  local: {
    type: String,
  },
  scheduledTo: {
    type: String,
    required: true,
  },
  executedIn: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
});

jobSchema.plugin(autoIncrement.plugin, {
  model: "Job",
  field: "quoteNumber",
  startAt: 1,
  incrementBy: 1,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
