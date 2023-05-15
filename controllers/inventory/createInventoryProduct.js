const Inventory = require("../../models/inventory/Inventory.model");

const createInventoryProduct = async (req, res, next) => {
  try {
    const { body } = req;

    const newInventory = await Inventory.create(body);

    res.send({
      type: "CreateInventory : Create",
      status: "success",
      message: "Inventory created successfully",
      newInventory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createInventoryProduct;
