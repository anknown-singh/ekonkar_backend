const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    catalogue: { type: Schema.Types.ObjectId, ref: "Catalogue" },
    quantity: { type: Number, default: 1 },
    status: { type: String, enum: ["ordered", "created"], default: "created" },
  },
  {
    timestamps: true,
  }
);

const Cart = model("Cart", cartSchema, "cart");

// make this available to our users in our Node applications
module.exports = Cart;
