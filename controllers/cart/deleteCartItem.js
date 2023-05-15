const Cart = require("../../models/cart/Cart.model");

const createCartItem = async (req, res, next) => {
  try {
    const { params } = req;

    const deletedCartItem = await Cart.findByIdAndRemove(params.id);

    res.send({
      type: "Cart : Delete",
      status: "success",
      message: "Item deleted from cart successfully",
      deletedCartItem,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createCartItem;
