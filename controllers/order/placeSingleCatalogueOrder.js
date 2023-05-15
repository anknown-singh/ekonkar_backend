const Order = require("../../models/order/Order.model");
const Cart = require("../../models/cart/Cart.model");

const placeOrder = async (req, res) => {
  const {
    user: { _id },
    query: { catalogue: catalogueId, quantity },
  } = req;

  const items = {
    catalogue: catalogueId,
    user: _id,
    quantity,
  };

  const tempCartCreated = await Cart.insertMany(items);
  const tempCart = await Cart.find({
    user: _id,
    _id: tempCartCreated?.map((item) => item?._id),
  })
    .populate("catalogue")
    .lean();

  const orderPrice = tempCart
    ?.map((item) => Number(item?.catalogue.finalPrice))
    .reduce((prev, curr) => curr + prev, 0);

  const totalQuantity = tempCart
    ?.map((item) => item?.quantity)
    .reduce((prev, curr) => prev + curr);

  const newOrder = await Order.create({
    user: _id,
    products: tempCart,
    status: "ordered",
    quantity: totalQuantity,
    orderPrice,
    mode: "catalogue",
  });

  const updatedCart = await Cart.updateMany(
    {
      _id: { $in: tempCart?.map((item) => item?._id) },
    },
    { status: "ordered" }
  );
  res.send({
    type: "Order : Create",
    status: "success",
    message: "Fetched all orders successfully",
    orders: newOrder,
  });
};

module.exports = placeOrder;
