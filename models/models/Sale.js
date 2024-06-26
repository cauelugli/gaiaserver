const { mongoose } = require("../db");

saleSchema = new mongoose.Schema({
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  customer: {
    type: Object,
    required: true,
  },
  commentary: {
    type: String,
  },
  deliveredIn: {
    type: String,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryReceiver: {
    type: String,
  },
  deliveryReceiverPhone: {
    type: String,
  },
  deliveryScheduledTo: {
    type: String,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  interactions: [
    {
      activity: String,
      attachments: Array,
      date: String,
      number: Number,
      reactions: {
        dislike: { quantity: Number, usersReacted: [] },
        haha: { quantity: Number, usersReacted: [] },
        like: { quantity: Number, usersReacted: [] },
        love: { quantity: Number, usersReacted: [] },
      },
      user: String,
    },
  ],
  items: {
    type: Object,
  },
  manager: {
    type: Object,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  resolvedAt: {
    type: String,
  },
  resolvedBy: {
    type: String,
  },
  seller: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
