const Cart = require("../../models/cart/Cart.model");

const createCartItem = async (req, res, next) => {
  try {
    const {
      body,
      user: { _id },
    } = req;

    const items = body?.products.map((product) => ({
      catalogue: product,
      user: _id,
    }));

    const newCartItems = await Cart.insertMany(items);

    res.send({
      type: "Cart : Create",
      status: "success",
      message: "Item added to cart successfully",
      newCartItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createCartItem;
