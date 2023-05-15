const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    avatar: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    attributes: [{ type: Schema.Types.ObjectId, ref: "Attribute" }],
    orderPrice: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Cart" }],
    mode: { type: String, enum: ["moodboard", "catalogue"], required: true },
    discountValue: { type: String },
    discountType: { type: String, enum: ["percentage", "price"] },
    quantity: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "ordered",
        "structureReady",
        "upholsteryReady",
        "readyForDelivery",
        "delivered",
      ],
      default: "ordered",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema, "order");

// make this available to our users in our Node applications
module.exports = Order;
