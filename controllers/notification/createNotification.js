const Notification = require("../../models/notification/Notification.model");

const createNotification = async (req, res) => {
  const { body } = req;

  const newNotification = await Notification.create({
    user: body.user,
    message: body.message,
  });

  res.send({
    type: "Notification",
    status: "success",
    message: "Notifications created successfully",
    notifications: newNotification,
  });
};

module.exports = createNotification;
