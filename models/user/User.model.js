const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    primaryContact: { type: Schema.Types.ObjectId, ref: "Contact" },
    role: {
      type: String,
      default: "customer",
      enum: ["superadmin", "admin", "agent", "customer"],
    },

    isVerified: { type: Boolean, required: true, default: false },
    type: { type: String, default: "user", enum: ["user", "staff"] },
    status: { type: Boolean, required: true, default: false },
    isDisabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema, "user");

// make this available to our users in our Node applications
module.exports = User;
