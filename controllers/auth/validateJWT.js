const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret, accessTokenLife } =
  require("../../config/keys").jwt;
const Token = require("../../models/Token.model");

const { generateAccessToken } = require("../../services/generate_token");

const validateAccessToken = async (req, res, next) => {
  var refreshToken = "",
    accessToken = "";

  if (req.cookies?.refreshToken && req.cookies?.accessToken) {
    refreshToken = req.cookies.refreshToken;
    accessToken = req.cookies.accessToken;
  } else {
    refreshToken = req.headers.refreshtoken;
    accessToken = req.headers.accesstoken;
  }

  if (!refreshToken) {
    return next(createError.Unauthorized("Please login again"));
  }

  if (accessToken) {
    jwt.verify(accessToken, accessSecret, async (err, decoded) => {
      if (err) {
        return next(
          createError.Unauthorized("Session expired. Please login again.")
        );
      }
      res.json({
        type: "UserVerify",
        status: "success",
        user: decoded,
        auth: true,
        message: "User verified successfully",
      });
    });
  } else if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, refreshSecret);

      if (!payload)
        return next(
          createError.Unauthorized("Session expired. Please login again.")
        );

      const storedToken = await Token.findOne({
        user: payload._id,
        refreshToken: refreshToken,
      }).populate("user");

      if (!storedToken)
        return next(createError.Unauthorized("Please login again"));

      const accessToken = generateAccessToken(
        { ...storedToken.user },
        accessTokenLife
      );

      if (accessToken) {
        res.json({
          type: "UserLogin",
          status: "success",
          accessToken,
          message: "User logged in successfully",
          user: payload,
        });
      } else {
        res.json({
          type: "UserLogin",
          status: "unsuccessful",
          message: "User login unsuccessful",
        });
      }
    } catch (error) {
      console.log("error: ", error);
      return next(createError.InternalServerError());
    }
  }
};

module.exports = validateAccessToken;
