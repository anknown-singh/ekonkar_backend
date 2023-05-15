const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const UserLogin = require("../../models/UserLogin.model");
const Token = require("../../models/Token.model");
const User = require("../../models/user/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");

const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const loginUser = async (req, res, next) => {
  const { apikey } = req.headers;

  try {
    const decoded = Buffer.from(apikey, "base64").toString().split(":");
    [this.email, this.password, this.type] = decoded;

    const userLogin = await UserLogin.findOne({
      loginValue: this.email,
    }).populate("user");

    if (!userLogin) {
      throw createError.BadRequest(
        "Please try again! email / password is not correct"
      );
    }

    const isMatch = await bcrypt.compare(this.password, userLogin.password);
    if (!isMatch) {
      throw createError.Unauthorized(
        "Please try again! email / password is not correct"
      );
    }

    const accessToken = await generateAccessToken(
      userLogin.user.toObject(),
      accessTokenLife
    );
    const refreshToken = await generateRefreshToken(
      userLogin.user.toObject(),
      refreshTokenLife
    );

    if (accessToken && refreshToken) {
      const token = new Token({
        user: userLogin.user._id,
        refreshToken: refreshToken.value,
      });
      token.save();

      const update = await User.findByIdAndUpdate(
        userLogin.user?._id,
        {
          status: true,
        }
        // { new: true }
      );
      const userLoginNew = await UserLogin.findOne({
        loginValue: this.email,
      }).populate("user");
      // userLogin.user.status = true;
      // userLogin.save();

      res.json({
        type: "UserLogin",
        status: "success",
        accessToken,
        refreshToken,
        message: "User logged in successfully",
        user: userLoginNew.user,
      });
    }
  } catch (error) {
    console.log("error: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = loginUser;
