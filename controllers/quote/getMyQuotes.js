const Quote = require("../../models/quote/Quote.model");

const getMyQuotes = async (req, res) => {
  const {
    query,
    user: { _id },
  } = req;

  const allQuotes = await Quote.find({
    $or: [{ user: _id }, { agent: _id }],
  })
    .populate("user")
    .populate("agent")
    .sort({ createdAt: -1 })
    .limit(Number(query.limit) || 0)
    .lean();

  // console.log(
  //   JSON.stringify({
  //     type: "Get All Quotes",
  //     status: "success",
  //     message: "Fetched all quotes successfully",
  //     quotes: allQuotes,
  //   })
  // );

  res.send({
    type: "Get All Quotes",
    status: "success",
    message: "Fetched all quotes successfully",
    quotes: allQuotes,
  });
};

module.exports = getMyQuotes;
