const Inventory = require("../../models/inventory/Inventory.model");
const Attribute = require("../../models/inventory/Attribute.model");

const getInventoryAndSubAttributes = async (req, res, next) => {
  try {
    const { query } = req;
    const inventoryRaw = await Inventory.find({
      name: { $regex: query.name || "", $options: "i" },
      category: { $in: query.category },
    }).lean();

    const allProducts = inventoryRaw?.map((product) => product?._id);

    const attributesRaw = await Attribute.find({
      product: {
        $in: allProducts,
      },
    }).lean();

    const inventory = inventoryRaw?.reduce((prev, product) => {
      const parentAttributes = attributesRaw?.filter(
        (attribute) =>
          String(product._id) === String(attribute.product) &&
          !Object.keys(attribute).includes("parentAttribute")
      );

      const attributes = attributesRaw.filter(
        (attribute) =>
          String(product._id) === String(attribute.product) &&
          Object.keys(attribute).includes("parentAttribute")
      );

      return [
        ...prev,
        {
          ...product,
          attributes: parentAttributes,
          subAttributes: attributes,
        },
      ];
    }, []);

    // console.log(
    //   JSON.stringify({
    //     type: "GetInventory",
    //     status: "success",
    //     message: "Fetched all inventory successfully",
    //     inventory,
    //   })
    // );
    // console.log(inventory);
    // console.log(inventory?.subAttributes);

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

module.exports = getInventoryAndSubAttributes;
