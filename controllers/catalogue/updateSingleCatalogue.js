const Catalogue = require("../../models/catalogue/Catalogue.model");

const updateSingleCatalogue = async (req, res, next) => {
  try {
    const { params, body } = req;

    const catalogue = await Catalogue.findByIdAndUpdate(params?.id, body);

    res.send({
      type: "Catalogue : Update Single",
      status: "success",
      message: "Catalogue updated successfully",
      catalogue,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateSingleCatalogue;
