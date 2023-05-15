const Catalogue = require("../../models/catalogue/Catalogue.model");

const getCatalogue = async (req, res, next) => {
  try {
    const { params } = req;
    const catalogue = await Catalogue.findOne({ _id: params?.id });

    res.send({
      type: "Catalogue : Get",
      status: "success",
      message: "Catalogue fetched successfully",
      catalogue,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getCatalogue;
