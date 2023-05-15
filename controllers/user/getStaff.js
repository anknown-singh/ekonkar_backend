const User = require("../../models/user/User.model");

const getStaff = async (req, res, next) => {
  try {
    const { query } = req;

    const allUsers = await User.find({
      role: { $in: query.role },
      name: { $regex: query.name || "", $options: "i" },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.send({
      type: "GetUser: All",
      status: "success",
      message: "Fetched all users successfully",
      users: allUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getStaff;
