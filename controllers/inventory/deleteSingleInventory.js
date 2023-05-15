const Attribute = require("../../models/inventory/Attribute.model");
const Inventory = require("../../models/inventory/Inventory.model");

const deleteSingleInventory = async (req, res, next) => {
  try {
    const { params } = req;
    const inventory = await Inventory.findById(params.id);

    const deleteAttribute = await Attribute.deleteMany({
      product: inventory?._id,
    });

    const deletedInventory = await Inventory.findByIdAndRemove(inventory?._id);

    res.send({
      type: "Inventory : Delete One",
      status: "success",
      message: "Inventory deleted successfully",
      deletedInventory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = deleteSingleInventory;
