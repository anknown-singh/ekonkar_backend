const Catalogue = require("../../models/catalogue/Catalogue.model");

const deleteSingleCatalogue = async (req, res, next) => {
  try {
    const { params } = req;
    const deletedCatalogue = await Catalogue.findByIdAndRemove(params.id);

    res.send({
      type: "Catalogue : Delete",
      status: "success",
      message: "Catalogue deleted successfully",
      deletedCatalogue,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = deleteSingleCatalogue;
