const { Schema, model } = require("mongoose");

const catalogueSchema = new Schema(
  {
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    color: { type: String, required: true },
    discountApplicable: { type: Boolean, default: false, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], required: true },
  },
  {
    timestamps: true,
  }
);

const Catalogue = model("Catalogue", catalogueSchema, "catalogue");

// make this available to our users in our Node applications
module.exports = Catalogue;
