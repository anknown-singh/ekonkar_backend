const Order = require("../../models/order/Order.model");

const getOrderStatusCount = async (req, res) => {
  const count = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.send({
    type: "Order : Get",
    status: "success",
    message: "Fetched all orders status count successfully",
    orders: count,
  });
};

module.exports = getOrderStatusCount;
