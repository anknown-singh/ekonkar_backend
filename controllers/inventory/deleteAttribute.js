const Attribute = require("../../models/inventory/Attribute.model");

const deleteAttribute = async (req, res, next) => {
  try {
    const { params } = req;

    const deletedAttributes = await Attribute.deleteMany({
      $or: [
        { _id: params.id },
        {
          parentAttribute: params.id,
        },
      ],
    });

    res.send({
      type: "Inventory : Delete One",
      status: "success",
      message: "Inventory deleted successfully",
      deletedAttributes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = deleteAttribute;
