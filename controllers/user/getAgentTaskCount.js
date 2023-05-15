const Quote = require("../../models/quote/Quote.model");
const User = require("../../models/user/User.model");

const getAgentTaskCount = async (req, res) => {
  const count = await User.aggregate([
    {
      $lookup: {
        from: Quote.collection.name,
        localField: "_id",
        foreignField: "agent",
        as: "quote",
      },
    },
    {
      $match: {
        quote: {
          $elemMatch: {
            status: "negotiate",
          },
        },
      },
    },
    { $group: { _id: "$name", count: { $sum: 1 } } },
  ]);
  res.send({
    count: count,
  });
};

module.exports = getAgentTaskCount;
