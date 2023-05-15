const Attribute = require("../../models/inventory/Attribute.model");

const createInventoryAttribute = async (req, res, next) => {
  try {
    const { body } = req;

    const newAttribute = await Attribute.create(body);

    res.send({
      type: "CreateInventoryAttribute : Create",
      status: "success",
      message: "Inventory Attribute created successfully",
      newAttribute,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createInventoryAttribute;
