const User = require("../../models/user/User.model");
const Permission = require("../../models/permission/Permission.model");

const getUsers = async (req, res, next) => {
  try {
    const { user } = req;
    const userData = await User.findById(user?._id).lean();

    const permissions = await Permission.findOne({
      user: user._id,
    }).lean();
    res.send({
      type: "GetUser: Self",
      status: "success",
      message: "Fetched my users successfully",
      user: { ...userData, permissions: permissions?.permissions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
