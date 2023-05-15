const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const resetPasswordSchema = new Schema(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, expires: "5m", default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
// the schema is useless so far
// we need to create a model using it
const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

// make this available to our users in our Node applications
module.exports = ResetPassword;
