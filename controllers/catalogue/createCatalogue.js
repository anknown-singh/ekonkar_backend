const Catalogue = require("../../models/catalogue/Catalogue.model");

const createCatalogue = async (req, res, next) => {
  try {
    const {
      body,
      user: { _id },
    } = req;

    const newCatalogue = await Catalogue.create(body);

    res.send({
      type: "Catalogue : Create",
      status: "success",
      message: "Catalogue created successfully",
      newCatalogue,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createCatalogue;
