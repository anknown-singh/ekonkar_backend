const Notification = require("../../models/notification/Notification.model");

const getMyNotifications = async (req, res) => {
  const { user } = req;

  const myAllNotifications = await Notification.find({ user: user?._id });

  // console.log(
  //   JSON.stringify({
  //     type: "Notification",
  //     status: "success",
  //     message: "Notifications fetched successfully",
  //     notifications: myAllNotifications,
  //   })
  // );

  res.send({
    type: "Notification",
    status: "success",
    message: "Notifications fetched successfully",
    notifications: myAllNotifications,
  });
};

module.exports = getMyNotifications;
