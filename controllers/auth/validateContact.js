const Contact = require("../../models/Contact.model");
const createError = require("http-errors");

const validateContact = async (req, res, next) => {
  try {
    const {
      params: { value },
    } = req;
    const existingEmail = await Contact.findOne({
      contactValue: value,
    });
    // if (existingEmail) {
    //   res.send({
    //     success: false,
    //   });
    // } else {
    //   res.send({
    //     success: true,
    //   });
    // }

    if (!existingEmail) {
      throw createError.Conflict("Phone already exists.");
    }

    res.send({
      type: "UserRegister",
      status: "success",
      message: "User registered successfully",
      user: existingEmail,
    });
  } catch (error) {
    console.log("error register: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = validateContact;
