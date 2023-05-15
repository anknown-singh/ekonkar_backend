const Transaction = require("../../models/transaction/Transaction.model");

const geAllTransactions = async (req, res, next) => {
  try {
    const allTransactions = await Transaction.find().sort({ createdAt: -1 });

    res.send({
      type: "GetTransaction: All",
      status: "success",
      message: "Fetched all transactions successfully",
      transactions: allTransactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = geAllTransactions;
