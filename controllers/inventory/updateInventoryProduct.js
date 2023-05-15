const Inventory = require("../../models/inventory/Inventory.model");

const createInventoryProduct = async (req, res, next) => {
  try {
    const { body, query } = req;

    const updateInventory = await Inventory.findOneAndUpdate(
      { _id: query.id },
      body
    );

    res.send({
      type: "UpdateInventory : Update",
      status: "success",
      message: "Inventory updated successfully",
      updateInventory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createInventoryProduct;
