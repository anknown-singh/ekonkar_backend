const { Schema, model } = require("mongoose");

const { refreshTokenLife } = require("../config/keys").jwt;

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: refreshTokenLife,
    default: Date.now,
  },
});

const Token = model("Token", tokenSchema);

module.exports = Token;
