/* eslint-disable no-useless-escape */
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/user/User.model");
const Contact = require("../../models/Contact.model");
const UserLogin = require("../../models/UserLogin.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");
var AWS = require("aws-sdk");

const { generateCryptoKey } = require("../../services/generate_token");
// const { registerValidation } = require("../../services/validation_schema");
const generateOtp = require("../../services/generateOtp");

const userLogin = async (req, res, next) => {
  const { payload } = req.headers;

  const decoded = Buffer.from(payload, "base64").toString().split(":");
  [
    this.name,
    this.contactType,
    this.contactValue,
    this.password,
    this.type,
    this.role,
  ] = decoded;

  try {
    // validation code here

    if (this.contactType === "email" && typeof this.contactValue === "string") {
      if (!this.loginValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,9}$/g)) {
        throw createError.BadRequest("Email is required for registration.");
      }
    }
    if (this.contactType === "phone" && typeof this.contactValue === "string") {
      if (
        !this.contactValue
        // .match(
        //   /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/gm
        // )
      ) {
        throw createError.BadRequest("Phone is required for registration.");
      }
    }

    // const result = await registerValidation.validateAsync(this);

    // eslint-disable-next-line no-unused-vars
    const { contactType, contactValue, password, name, type, role } = this;

    // check for already registration of phone
    const existingEmail = await Contact.findOne({
      contactType,
      contactValue,
    });
    if (existingEmail) {
      throw createError.Conflict(
        `${contactValue} is already registered. Please login.`
      );
    }

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

    if (contactValue) {
      const newContact = new Contact({
        user: createdUser._id,
        contactType,
        contactValue,
      });

      const savedContact = await newContact.save();
      createdUser.primaryContact = savedContact._id;
    }

    createdUser.save();

    if (contactValue) {
      const userEmailLoginMech = new UserLogin({
        user: createdUser._id,
        loginType: contactType,
        loginValue: contactValue,
      });
      userEmailLoginMech.save();
    }

    // generate verify phone token and save to db
    if (contactValue) {
      const otp = generateOtp();
      const verificationToken = generateCryptoKey();
      const hashedToken = await bcrypt.hash(verificationToken, 10);
      const verification = new VerifyTokenModel({
        user: createdUser._id,
        token: hashedToken,
        otp,
        type: `verify-${contactType}`,
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

      // if (contactType === "phone") {
      //   var params = {
      //     Message: `OTP - ${otp}`,
      //     PhoneNumber: "+" + contactValue,
      //     MessageAttributes: {
      //       "AWS.SNS.SMS.SenderID": {
      //         DataType: "String",
      //         StringValue: "MNB-OTP",
      //       },
      //       "AWS.SNS.SMS.SMSType": {
      //         DataType: "String",
      //         StringValue: "Transactional",
      //       },
      //     },
      //   };

      //   var publishTextPromise = new AWS.SNS({
      //     region: "ap-south-1",
      //     apiVersion: "2010-03-31",
      //   })
      //     .publish(params)
      //     .promise();
      // }
    }

    // send response
    res.send({
      type: "UserRegister",
      status: "success",
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log("error register: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = userLogin;
