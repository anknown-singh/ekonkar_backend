const Quote = require("../../models/quote/Quote.model");
const { ObjectId } = require("mongoose").Types;
const convertParams = require("../../helpers/convertParams");

const getAllQuotes = async (req, res) => {
  const { query } = req;

  // console.log(query);

  const filter = convertParams(Quote, query);

  // console.log(filter);

  const allQuotes = await Quote.find({})
    .where()
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

module.exports = getAllQuotes;
// {
//   mode: {
//     $in: query?.mode
//       ? typeof query?.mode === "string"
//         ? [query?.mode]
//         : query?.mode
//       : null || ["quote", "order"],
//   },
// }
