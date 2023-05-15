const { Schema, model } = require("mongoose");

const deviceTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    deviceToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const DeviceToken = model("DeviceToken", deviceTokenSchema, "deviceToken");
module.exports = DeviceToken;
