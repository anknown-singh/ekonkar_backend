const Attribute = require("../../models/inventory/Attribute.model");

const getAttributes = async (req, res, next) => {
  try {
    const { query } = req;

    const attributesRaw = await Attribute.find({
      product: query?.product,
    }).lean();

    const parentAttributes = attributesRaw?.filter(
      (attribute) => !Object.keys(attribute).includes("parentAttribute")
    );

    const attributes = parentAttributes.map((pattribute) => {
      const subAttributes =
        attributesRaw.filter(
          (attribute) =>
            String(attribute.parentAttribute) === String(pattribute?._id)
        ) || [];
      return { ...pattribute, subAttributes };
    });

    res.send({
      type: "GetAttributes",
      status: "success",
      message: "Fetched all attributes successfully",
      attributes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAttributes;
