const Inventory = require("../../models/inventory/Inventory.model");
const Attribute = require("../../models/inventory/Attribute.model");

const getAllRequests = async (req, res, next) => {
  try {
    const { query } = req;
    const inventoryRaw = await Inventory.find({
      name: { $regex: query.name || "", $options: "i" },
    }).lean();
    const allProducts = inventoryRaw?.map((product) => product?._id);

    const attributesRaw = await Attribute.find({
      product: {
        $in: allProducts,
      },
    }).lean();

    const inventory = inventoryRaw?.map((product) => {
      const parentAttributes = attributesRaw?.filter(
        (attribute) =>
          String(product._id) === String(attribute.product) &&
          !Object.keys(attribute).includes("parentAttribute")
      );

      const attributes = attributesRaw
        .filter(
          (attribute) =>
            String(product._id) === String(attribute.product) &&
            Object.keys(attribute).includes("parentAttribute")
        )
        .map((pattribute) => {
          const subAttributes =
            attributesRaw.filter((attribute) => {
              return (
                String(attribute.parentAttribute) === String(pattribute?._id)
              );
            }) || [];
          return subAttributes;
        });
      return {
        ...product,
        attributes: parentAttributes.length,
        subAttributes: attributes.length,
      };
    });

    res.send({
      type: "GetInventory",
      status: "success",
      message: "Fetched all inventory successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllRequests;
