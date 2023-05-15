const User = require("../../models/user/User.model");

const updateUser = async (req, res, next) => {
  try {
    const { user: _id, body } = req;
    const updatedUser = await User.findOneAndUpdate({ _id }, body);

    res.send({
      type: "UpdateUser: Self",
      status: "success",
      message: "Updated user successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
