const createError = require("http-errors");
var ObjectId = require("mongoose").Types.ObjectId;
const { bypassOTP } = require("../../config/keys");
String.prototype.toObjectId = function () {
  return new ObjectId(this.toString());
};

// import verify token model and user model
const User = require("../../models/user/User.model");
const ContactMech = require("../../models/Contact.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");

const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const verifyUser = async (req, res, next) => {
  try {
    const { otptoken } = req.headers;
    const otpDecoded = Buffer.from(otptoken, "base64").toString().split(":");
    [this.otp, this.otptoken, this.loginValue, this.loginType] = otpDecoded;
    const { otp, otptoken: otpToken, loginValue, loginType } = this;

    const notVerifiedContact = await ContactMech.findOne({
      contactType: loginType,
      contactValue: loginValue,
    });

    let tokenDetails;
    let user;

    if (notVerifiedContact) {
      tokenDetails = await VerifyTokenModel.findOne({
        user: notVerifiedContact?.user,
        type: `verify-${loginType}`,
      });

      if (bypassOTP) {
        user = await User.findOne({ _id: notVerifiedContact.user });
        if (!user)
          throw createError.BadRequest(
            "We were unable to find a user for this verification.!"
          );
        // if (user.isVerified) {
        //   throw createError.BadRequest(
        //     "User has been already verified. Please Login"
        //   );
        // }
        if (!user.isVerified) {
          user.isVerified = true;
        }
      } else {
        if (tokenDetails?.otp !== otp) {
          throw createError.BadRequest("OTP didn't match");
        }
        user = await User.findOne({ _id: tokenDetails.user });
        if (!user)
          throw createError.BadRequest(
            "We were unable to find a user for this verification.!"
          );
        // if (user.isVerified) {
        //   throw createError.BadRequest(
        //     "User has been already verified. Please Login"
        //   );
        // }
        if (!user.isVerified) {
          user.isVerified = true;
        }
      }
    } else {
      throw createError.BadRequest("No user found!");
    }

    const updatedUser = await user.save();
    if (!updatedUser)
      throw createError.InternalServerError(
        "User could not be verified. Please try again."
      );

    const accessToken = await generateAccessToken(
      updatedUser.toObject(),
      accessTokenLife
    );
    const refreshToken = await generateRefreshToken(
      updatedUser.toObject(),
      refreshTokenLife
    );

    await VerifyTokenModel.findOneAndDelete({
      user: tokenDetails?.user,
      token: tokenDetails?.token,
      type: `verify-${loginType}`,
    });

    // console.log(
    //   JSON.stringify({
    //     type: "Auth: Login",
    //     status: "success",
    //     message: "User login successful",
    //     user: user,
    //     accessToken,
    //     refreshToken,
    //   })
    // );

    res.json({
      type: "Auth: Login",
      status: "success",
      message: "User login successful",
      user: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = verifyUser;
