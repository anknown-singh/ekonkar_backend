const User = require("../../models/user/User.model");

const testScript = async (req, res) => {
  const allUsers = await User.find().lean();

  const updatedIsDisabled = allUsers.map(async (user) => {
    const singleDisabled = await User.findByIdAndUpdate(user._id, {
      isDisabled: false,
      status: false,
    });
    return singleDisabled;
  });

  res.send(updatedIsDisabled);
};

module.exports = testScript;
