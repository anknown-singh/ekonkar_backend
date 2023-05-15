const Attribute = require("../../models/inventory/Attribute.model");

const updateManyInventoryAttribute = async (req, res, next) => {
  try {
    const { body } = req;

    const updateAttributes = body.reduce((prev, curr) => {
      return [
        ...prev,
        {
          updateOne: {
            filter: { _id: curr._id },
            update: {
              ...Object.keys(curr)
                .filter((key) => key !== "_id")
                .reduce(
                  (keyPrev, keyCurr) => ({
                    ...keyPrev,
                    [keyCurr]: curr[keyCurr],
                  }),
                  {}
                ),
            },
          },
        },
      ];
    }, []);

    const updatedAttributes = await Attribute.bulkWrite(updateAttributes);

    const fetched = await Attribute.find({
      _id: { $in: body?.map((attribute) => attribute?._id) },
    });

    res.send({
      type: "UpdateInventoryAttributes : Update",
      status: "success",
      message: "Inventory Attributes updated successfully",
      updatedAttributes: fetched,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateManyInventoryAttribute;
