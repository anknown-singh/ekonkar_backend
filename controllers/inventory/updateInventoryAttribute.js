const Attribute = require("../../models/inventory/Attribute.model");

const updateInventoryAttribute = async (req, res, next) => {
  try {
    const { query, body } = req;
    const updatedAttribute = await Attribute.findByIdAndUpdate(query.id, body);

    res.send({
      type: "UpdateInventoryAttribute : Update",
      status: "success",
      message: "Inventory Attribute updated successfully",
      updatedAttribute,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateInventoryAttribute;
