const Attribute = require("../../models/inventory/Attribute.model");

const testScript = async (req, res) => {
  const allAttributes = await Attribute.find().lean();

  const updatedAvatars = allAttributes.map(async (attribute) => {
    console.log(attribute.avatar);
    if (typeof attribute.avatar === "string") {
      const singleAvatar = await Attribute.findByIdAndUpdate(attribute._id, {
        avatar: [attribute.avatar],
      });
      return singleAvatar;
    }
  });

  res.send(updatedAvatars);
};

module.exports = testScript;
