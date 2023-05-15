const { Schema, model } = require("mongoose");

const workSchema = new Schema(
  {
    status: { type: String, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    work: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Work = model("Work", workSchema, "work");

module.exports = Work;
