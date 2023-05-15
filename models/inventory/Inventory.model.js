const { Schema, model } = require("mongoose");

const inventorySchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    avatar: [{ type: String }],
    status: { type: String, enum: ["active", "inactive"], required: true },
  },
  {
    timestamps: true,
  }
);

const Inventory = model("Inventory", inventorySchema, "inventory");

// make this available to our users in our Node applications
module.exports = Inventory;
