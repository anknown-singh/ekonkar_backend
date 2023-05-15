const Order = require("../../models/order/Order.model");
const Cart = require("../../models/cart/Cart.model");

const placeOrder = async (req, res) => {
  const {
    user: { _id },
  } = req;

  const cart = await Cart.find({ user: _id }).populate("catalogue").lean();

  const orderPrice = cart
    ?.map((item) => Number(item?.catalogue?.finalPrice))
    .reduce((prev, curr) => curr + prev, 0);

  const totalQuantity = cart
    ?.map((item) => item?.quantity)
    .reduce((prev, curr) => prev + curr);

  const newOrder = await Order.create({
    user: _id,
    products: cart,
    status: "ordered",
    quantity: totalQuantity,
    orderPrice: orderPrice,
    mode: "catalogue",
  });
  res.send({
    type: "Order : Create",
    status: "success",
    message: "Fetched all orders successfully",
    orders: newOrder,
  });
};

module.exports = placeOrder;
