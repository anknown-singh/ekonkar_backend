const Quote = require("../../models/quote/Quote.model");
const User = require("../../models/user/User.model");

const getQuoteCount = async (req, res) => {
  // const quoteId = await Quote.find({ status: "completed" }).select("user -_id");

  const count = await Quote.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const ongoingCount = await Quote.aggregate([
    {
      $match: { status: "requested", status: "negotiate" },
    },
    // group in count
    {
      $count: "count",
    },
    // unwind
    // grouping in 4 variables/keys
  ]);
  const newClientsAssignCount = await User.aggregate([
    {
      $lookup: {
        from: Quote.collection.name,
        localField: "_id",
        foreignField: "user",
        as: "quote",
      },
    },
    {
      $match: {
        "quote.status": {
          $in: ["negotiate", "rejected", "requested"],
        },
      },
    },
    {
      $count: "count",
    },
  ]);

  res.send({
    group: count,
    ongoing: ongoingCount,
    newclients: newClientsAssignCount,
  });
};

module.exports = getQuoteCount;
