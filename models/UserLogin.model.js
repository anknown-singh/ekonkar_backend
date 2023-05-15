const { Schema, model } = require("mongoose");

const UserLoginSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    loginType: {
      type: String,
      valueType: "String",
      trim: true,
    },
    loginValue: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserLoginMech = model("UserLogin", UserLoginSchema);

// make this available to our users in our Node applications
module.exports = UserLoginMech;
