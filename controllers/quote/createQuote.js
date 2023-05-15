const Quote = require("../../models/quote/Quote.model");

const createQuote = async (req, res) => {
  const {
    body,
    user: { _id },
  } = req;

  const newQuote = await Quote.create({
    ...body,
    quantity: Number(body?.quantity) || 1,
    user: _id,
  });

  res.send({
    type: "Create Quote",
    status: "success",
    message: "Created new quote successfully",
    quote: newQuote.toObject(),
  });
};

module.exports = createQuote;
