const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    quote: { type: Schema.Types.ObjectId, ref: "Quote" },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    paymentAmount: { type: Number },
    paymentStep: { type: String, enum: ["initial", "part"] },
  },
  {
    timestamps: true,
  }
);

const Payment = model("Payment", paymentSchema, "payment");

// make this available to our users in our Node applications
module.exports = Payment;
