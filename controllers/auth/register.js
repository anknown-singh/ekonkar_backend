/* eslint-disable no-useless-escape */
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/user/User.model");
const Contact = require("../../models/Contact.model");
const UserLogin = require("../../models/UserLogin.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");
const Permission = require("../../models/permission/Permission.model");
var AWS = require("aws-sdk");

const { generateCryptoKey } = require("../../services/generate_token");
// const { registerValidation } = require("../../services/validation_schema");
const generateOtp = require("../../services/generateOtp");

const registerUser = async (req, res, next) => {
  const {
    headers: { payload },
    body,
  } = req;

  const decoded = Buffer.from(payload, "base64").toString().split(":");
  [
    this.name,
    this.loginType,
    this.loginValue,
    this.password,
    this.type,
    this.role,
    this.phone,
  ] = decoded;

  try {
    // validation code here

    if (this.loginType === "email" && typeof this.loginValue === "string") {
      if (!this.loginValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,9}$/g)) {
        throw createError.BadRequest("Email is required for registration.");
      }
    }
    if (this.loginType === "phone" && typeof this.loginValue === "string") {
      if (
        !this.loginValue
        // .match(
        //   /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/gm
        // )
      ) {
        throw createError.BadRequest("Phone is required for registration.");
      }
    }

    // const result = await registerValidation.validateAsync(this);

    // eslint-disable-next-line no-unused-vars
    const { loginType, loginValue, password, name, type, role, phone } = this;

    // check for already registration of phone
    const existingEmail = await Contact.findOne({
      contactType: loginType,
      contactValue: loginValue,
    });
    if (existingEmail) {
      throw createError.Conflict(
        `${loginValue} is already registered. Please login.`
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
      user.status = false;
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

      if (phone) {
        const newPhoneContact = new Contact({
          user: createdUser._id,
          contactType: "phone",
          contactValue: phone,
        });

        await newPhoneContact.save();
      }
    }

    createdUser.save();

    // this runs when the user is new
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (loginValue) {
      const userEmailLoginMech = new UserLogin({
        user: createdUser._id,
        loginType,
        loginValue: loginValue,
        password: hashedPassword,
      });
      userEmailLoginMech.save();
    }

    const permissionsList = {
      superadmin: [
        {
          title: "Dashboard",
          access: true,
          path: "/",
        },
        {
          title: "Quotations",
          access: true,
          path: "/quotations",
        },
        {
          title: "Staff",
          access: true,
          path: "/staff",
        },
        {
          title: "Orders",
          access: true,
          path: "/orders",
        },
        {
          title: "Field Agents",
          access: true,
          path: "/fieldagents",
        },
        {
          title: "Inventory",
          access: true,
          path: "/inventory",
        },
        {
          title: "Customers",
          access: true,
          path: "/customers",
        },
        {
          title: "Catalogue",
          access: true,
          path: "/catalogue",
        },
      ],
      admin: [
        {
          title: "Dashboard",
          access: true,
          path: "/",
        },
        {
          title: "Quotations",
          access: true,
          path: "/quotations",
        },
        {
          title: "Orders",
          access: true,
          path: "/orders",
        },
        {
          title: "Field Agents",
          access: true,
          path: "/fieldagents",
        },
        {
          title: "Inventory",
          access: true,
          path: "/inventory",
        },
      ],
      agent: [
        {
          title: "Dashboard",
          access: true,
          path: "/",
        },
        {
          title: "Quotations",
          access: true,
          path: "/quotations",
        },
      ],
    };

    if (createdUser) {
      if (createdUser.type === "staff") {
        const permissions = await Permission.create({
          user: createdUser._id,
          permissions: permissionsList[role] || [],
        });
      }
    }

    // generate verify phone token and save to db
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

      // email verification code

      // send verification email to saved user
      // await sendEmail(
      //   [email],
      //   "Verify your Property Yards account",
      //   verifyEmailTemplate({ name: createdUser.name }, otp)
      // );

      // phone verification code

      if (loginValue === "phone") {
        var params = {
          Message: `OTP - ${otp}`,
          PhoneNumber: "+" + loginValue,
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
          region: "ap-south-1",
          // apiVersion: "2010-03-31",
        })
          .publish(params)
          .promise();
      }
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

module.exports = registerUser;
