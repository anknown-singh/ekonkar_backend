const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", notificationSchema, "notification");
module.exports = Notification;
