const Order = require("../../models/order/Order.model");

const getOrderStatistics = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$price" },
      },
    },
  ]);
};

module.exports = getOrderStatistics;
