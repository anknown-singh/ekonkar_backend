const Wallet = require("../../models/wallet/Wallet.model");

const getWallet = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const wallet = await Wallet.find({ user: id }).populate("user");

    res.send(wallet);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getWallet;
