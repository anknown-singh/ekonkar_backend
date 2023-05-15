const Catalogue = require("../../models/catalogue/Catalogue.model");

const getCatalogue = async (req, res, next) => {
  try {
    const { query } = req;
    const allCatalogue = await Catalogue.find({
      name: { $regex: query.name || "", $options: "i" },
    });

    res.send({
      type: "Catalogue : Get",
      status: "success",
      message: "Catalogue fetched successfully",
      allCatalogue,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getCatalogue;
