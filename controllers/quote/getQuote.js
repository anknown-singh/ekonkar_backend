const Quote = require("../../models/quote/Quote.model");

const getQuote = async (req, res) => {
  const {
    params: { id },
  } = req;
  const quote = await Quote.findOne({ _id: id })
    .populate({
      path: "attributes",
      model: "Attribute",
      populate: {
        path: "product",
        model: "Inventory",
      },
    })
    .populate({
      path: "user",
      model: "User",
      populate: {
        path: "primaryContact",
        model: "Contact",
      },
    })
    .populate({
      path: "agent",
      model: "User",
      populate: {
        path: "primaryContact",
        model: "Contact",
      },
    })
    .lean();

  res.send({
    type: "Get Quote",
    status: "success",
    message: "Fetched quote successfully",
    quote: quote,
  });
};

module.exports = getQuote;
