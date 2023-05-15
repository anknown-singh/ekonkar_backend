const Cart = require("../../models/cart/Cart.model");

const getMyCart = async (req, res, next) => {
  try {
    const {
      query,
      user: { _id },
    } = req;

    const cartItems = await Cart.find({ user: _id })
      .sort({ createdAt: -1 })
      .populate("catalogue");

    // console.log(
    //   JSON.stringify({
    //     type: "Cart : Get",
    //     status: "success",
    //     message: "Cart fetched successfully",
    //     cartItems,
    //   })
    // );

    res.send({
      type: "Cart : Get",
      status: "success",
      message: "Cart fetched successfully",
      cartItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getMyCart;
