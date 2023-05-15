const Contact = require("../../models/Contact.model");
const Order = require("../../models/order/Order.model");

const getMyOrders = async (req, res) => {
  const {
    user: { _id },
    query
  } = req;

  const allOrders = await Order.find({ user: _id })
    .populate("agent")
    .populate("user")
    .populate({
      path: "products",
      populate: {
        path: "catalogue",
      },
    })
    .populate({
      path: "attributes",
      populate: {
        path: "product",
      },
    })
    .limit(Number(query.limit) || 0)
    .lean();

  const allUsers = allOrders.reduce((prev, curr) => {
    var users = [];

    if (curr?.user) {
      users = [...users, curr?.user?._id];
    }

    if (curr?.agent) {
      users = [...users, curr?.agent?._id];
    }

    return [...prev, ...users];
  }, []);

  const allContacts = await Contact.find({
    user: {
      $in: allUsers,
    },
  }).lean();

  const response = allOrders.map((order) => {
    let user = order.user;
    let agent = order.agent;
    const userContacts = allContacts.filter(
      (contact) => String(contact?.user) === String(order?.user?._id)
    );
    const agentContacts = allContacts.filter(
      (contact) => String(contact?.user) === String(order?.agent?._id)
    );
    user.contacts = userContacts;
    if (agent) {
      agent.contacts = agentContacts;
    }

    return { ...order, user, agent };
  });

  res.send({
    type: "Order : Get",
    status: "success",
    message: "Fetched all orders successfully",
    orders: response,
  });
};

module.exports = getMyOrders;
