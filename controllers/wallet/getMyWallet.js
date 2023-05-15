const Wallet = require("../../models/wallet/Wallet.model");

const getMyWallet = async (req, res, next) => {
  try {
    const {
      user: { _id },
    } = req;
    const wallet = await Wallet.find({ user: _id }).populate("user");

    res.send(wallet);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getMyWallet;
