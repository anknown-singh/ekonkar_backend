const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const createCatalogue = require("../../controllers/catalogue/createCatalogue");
const deleteSingleCatalogue = require("../../controllers/catalogue/deleteSingleCatalogue");
const updateSingleCatalogue = require("../../controllers/catalogue/updateSingleCatalogue");
const getCatalogue = require("../../controllers/catalogue/getCatalogue");
const getSingleCatalogue = require("../../controllers/catalogue/getSingleCatalogue");

// login user
router.get("/", validateAccessToken, getCatalogue);
router.post("/", validateAccessToken, createCatalogue);
router.get("/:id", getSingleCatalogue);
router.put("/:id", validateAccessToken, updateSingleCatalogue);
router.delete("/:id", validateAccessToken, deleteSingleCatalogue);

module.exports = router;
