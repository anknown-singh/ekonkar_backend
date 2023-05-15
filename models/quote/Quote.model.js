const { Schema, model } = require("mongoose");

const quoteSchema = new Schema(
  {
    avatar: { type: String },
    quantity: { type: Number, default: 1 },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    attributes: [{ type: Schema.Types.ObjectId, ref: "Attribute" }],
    productPrice: { type: String },
    finalPrice: { type: String },
    // mode: { type: String, enum: ["order", "quote"], default: "quote" },
    discountValue: { type: String },
    discountType: { type: String, enum: ["percentage", "price"] },
    status: {
      type: String,
      enum: ["requested", "negotiate", "completed", "rejected"],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

const Quote = model("Quote", quoteSchema, "quote");

// make this available to our users in our Node applications
module.exports = Quote;
