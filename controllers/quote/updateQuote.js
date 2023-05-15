const Quote = require("../../models/quote/Quote.model");
const createError = require("http-errors");

const updateQuote = async (req, res, next) => {
  try {
    const {
      body,
      params: { id },
    } = req;

    let finalPrice;

    if (body.productPrice < 1) {
      throw createError.BadRequest("Product Price cannot be less than 1");
    }
    if (body.discountValue < 0) {
      throw createError.BadRequest("discount value cannot be less than 0");
    }

    if (body.discountType === "price") {
      finalPrice = body.productPrice - body.discountValue;
    }
    if (body.discountType === "percentage") {
      finalPrice =
        body.productPrice - body.productPrice * (body.discountValue / 100);
    }

    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: id },
      { ...body, finalPrice },
      { new: true, lean: true }
    );

    res.send({
      type: "Update Quote",
      status: "success",
      message: "Updated quote successfully",
      quote: updatedQuote,
    });
  } catch (error) {
    console.log("error: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = updateQuote;
