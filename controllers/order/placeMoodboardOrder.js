const Order = require("../../models/order/Order.model");
const Quote = require("../../models/quote/Quote.model");
const getFinalPrice = require("../../helpers/getFinalPrice");

const placeOrder = async (req, res) => {
  const {
    user: { _id },
    query: { quoteId },
    params: { mode },
  } = req;

  const quote = await Quote.findOne({ _id: quoteId }).lean();

  const finalPice = getFinalPrice(
    quote?.productPrice,
    quote?.discountType,
    quote?.discountValue
  );

  const updatedQuote = await Quote.findOneAndUpdate(
    { _id: quoteId },
    { status: "completed" }
  );

  const newOrder = await Order.create({
    ...quote,
    status: "ordered",
    mode: 'moodboard',
    user: _id,
    orderPrice: finalPice,
    attributes: quote.attributes,
  });

  res.send({
    type: "Order : Create",
    status: "success",
    message: "Fetched all orders successfully",
    orders: newOrder,
  });
};

module.exports = placeOrder;
