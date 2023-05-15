const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const AWS = require("aws-sdk");

// import models and helpers
const UserLogin = require("../../models/UserLogin.model");
const User = require("../../models/user/User.model");
const Contact = require("../../models/Contact.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");

const generateOtp = require("../../services/generateOtp");
const { generateCryptoKey } = require("../../services/generate_token");

const { accessKeyId, secretAccessKey, region, sesSenderAddress } =
  require("../../config/keys").aws;
var params = {};

const loginUser = async (req, res, next) => {
  const { apikey } = req.headers;

  try {
    const decoded = Buffer.from(apikey, "base64").toString().split(":");
    [
      this.name,
      this.loginType,
      this.loginValue,
      this.password,
      this.type,
      this.role,
    ] = decoded;

    const { loginType, loginValue, password, name, type, role } = this;

    if (loginType === "email" && typeof loginValue === "string") {
      if (!loginValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,9}$/g)) {
        throw createError.BadRequest("Email is required for registration.");
      }
    }
    if (loginType === "phone" && typeof loginValue === "string") {
      if (
        !loginValue
        // .match(
        //   /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/gm
        // )
      ) {
        throw createError.BadRequest("Phone is required for registration.");
      }
    }

    const userLogin = await UserLogin.findOne({
      loginValue,
    }).populate("user");

    if (!userLogin) {
      //   throw createError.BadRequest(
      //     "Please try again! email / password is not correct"
      //   );

      //   const isMatch = await bcrypt.compare(this.password, userLogin.password);
      //   if (!isMatch) {
      //     throw createError.Unauthorized(
      //       "Please try again! email / password is not correct"
      //     );
      //   }

      //   const accessToken = await generateAccessToken(
      //     userLogin.user.toObject(),
      //     accessTokenLife
      //   );
      //   const refreshToken = await generateRefreshToken(
      //     userLogin.user.toObject(),
      //     refreshTokenLife
      //   );
      const user = new User({});

      if (name) {
        user.name = name;
      }

      if (type === "staff") {
        if (!role) {
          throw createError.Conflict(`Please provide a role.`);
        }

        user.type = type;
        user.role = role;
      }

      // Save user to DB

      const createdUser = await user.save();
      if (!createdUser)
        throw createError.InternalServerError(
          "Your request could not be processed. Please contact support or try again after some time."
        );

      if (loginValue) {
        const newContact = new Contact({
          user: createdUser._id,
          contactType: loginType,
          contactValue: loginValue,
        });

        const savedContact = await newContact.save();
        createdUser.primaryContact = savedContact._id;
      }

      if (loginValue) {
        const userEmailLoginMech = new UserLogin({
          user: createdUser._id,
          loginType,
          loginValue: loginValue,
        });
        userEmailLoginMech.save();
      }

      createdUser.save();

      if (loginValue) {
        const otp = generateOtp();
        const verificationToken = generateCryptoKey();
        const hashedToken = await bcrypt.hash(verificationToken, 10);
        const verification = new VerifyTokenModel({
          user: createdUser._id,
          token: hashedToken,
          otp,
          type: `verify-${loginType}`,
        });

        await verification.save();

        // send verification email to saved user
        // await sendEmail(
        //   [email],
        //   "Verify your Property Yards account",
        //   verifyEmailTemplate({ name: createdUser.name }, otp)
        // );

        // res.status(200).json({
        //   success: true,
        //   otptoken: verificationToken,
        //   otp,
        // });

        if (loginType === "phone") {
          params = {
            Message: `OTP - ${otp}`,
            PhoneNumber: loginValue,
            MessageAttributes: {
              "AWS.SNS.SMS.SenderID": {
                DataType: "String",
                StringValue: "MNB-OTP",
              },
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          };

          var publishTextPromise = new AWS.SNS({
            accessKeyId,
            secretAccessKey,
            region: "ap-south-1",
            apiVersion: "2010-03-31",
          })
            .publish(params)
            .promise();
        }
      }

      res.json({
        type: "Auth: Register",
        status: "success",
        message: "User register successful",
        user: createdUser,
      });
    } else {
      //   const isMatch = await bcrypt.compare(this.password, userLogin.password);
      //   if (!isMatch) {
      //     throw createError.Unauthorized(
      //       "Please try again! email / password is not correct"
      //     );
      //   }

      //   const accessToken = await generateAccessToken(
      //     userLogin.user.toObject(),
      //     accessTokenLife
      //   );
      //   const refreshToken = await generateRefreshToken(
      //     userLogin.user.toObject(),
      //     refreshTokenLife
      //   );

      const otpDoc = await VerifyTokenModel.findOne({
        user: userLogin?.user?._id,
      }).sort({ _id: -1 });

      if (!otpDoc) {
        const otp = generateOtp();
        const verificationToken = generateCryptoKey();
        const hashedToken = await bcrypt.hash(verificationToken, 10);
        const verification = new VerifyTokenModel({
          user: userLogin?.user?._id,
          token: hashedToken,
          otp,
          type: `verify-${loginType}`,
        });

        await verification.save();

        // send verification email to saved user
        // await sendEmail(
        //   [email],
        //   "Verify your Property Yards account",
        //   verifyEmailTemplate({ name: createdUser.name }, otp)
        // );

        // res.status(200).json({
        //   success: true,
        //   otptoken: verificationToken,
        //   otp,
        // });

        if (loginType === "phone") {
          params = {
            Message: `OTP - ${otp}`,
            PhoneNumber: loginValue,
            MessageAttributes: {
              "AWS.SNS.SMS.SenderID": {
                DataType: "String",
                StringValue: "MNB-OTP",
              },
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          };

          var publishTextPromise = new AWS.SNS({
            accessKeyId,
            secretAccessKey,
            region: "ap-south-1",
            apiVersion: "2010-03-31",
          })
            .publish(params)
            .promise();
        }
      } else {
        if (loginType === "phone") {
          params = {
            Message: `OTP - ${otpDoc?.otp}`,
            PhoneNumber: loginValue,
            MessageAttributes: {
              "AWS.SNS.SMS.SenderID": {
                DataType: "String",
                StringValue: "MNB-OTP",
              },
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          };
          
          var publishTextPromise = new AWS.SNS({
            accessKeyId,
            secretAccessKey,
            region: "ap-south-1",
            apiVersion: "2010-03-31",
          })
            .publish(params)
            .promise();
        }
      }

      res.json({
        type: "Auth: Login",
        status: "success",
        message: "User login successful",
        user: userLogin.user,
      });
    }
  } catch (error) {
    console.log("error: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = loginUser;
