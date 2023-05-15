const User = require("../../models/user/User.model");
const DeviceToken = require("../../models/deviceToken/DeviceToken.model");
var AWS = require("aws-sdk");

const updateMyUser = async (req, res, next) => {
  try {
    const { user: _id, body } = req;
    const updatedUser = await User.findOneAndUpdate({ _id }, body);

    if (body.deviceToken) {
      var params = {
        TopicArn:
          "arn:aws:sns:us-east-1:115464303762:app/GCM/MNB-push-notification",
        Protocol: "application",
        Endpoint: body.deviceToken,
      };
      const oldDeviceToken = await DeviceToken.findOne({ user: _id });

      if (!oldDeviceToken) {
        const newDeviceToken = await DeviceToken.create({
          user: _id,
          deviceToken: body.deviceToken,
        });

        // var newDeviceSubscribePromise = new AWS.SNS({
        //   region: "us-east-1",
        // })
        //   .subscribe(params)
        //   .promise();
      } else {
        const updatedDeviceToken = await DeviceToken.findOneAndUpdate(
          { user: _id },
          { deviceToken: body.deviceToken }
        );
      }
    }

    res.send({
      type: "UpdateUser: Self",
      status: "success",
      message: "Updated User successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateMyUser;
