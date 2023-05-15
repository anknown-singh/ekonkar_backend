const { Schema, model } = require("mongoose");

const attributeSchema = new Schema(
  {
    name: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Inventory" },
    avatar:  [{ type: String }],
    status: { type: String, enum: ["active", "inactive"], required: true },
    parentAttribute: { type: Schema.Types.ObjectId, ref: "Attribute" },
  },
  {
    timestamps: true,
  }
);

const Attribute = model("Attribute", attributeSchema, "attribute");

// make this available to our users in our Node applications
module.exports = Attribute;
