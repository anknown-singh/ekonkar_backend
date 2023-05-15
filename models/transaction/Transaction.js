const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    title: { type: String, enum: ["intial", "balance", "final"] },
    amount: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema, "transaction");
