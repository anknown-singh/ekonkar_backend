const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const createQuote = require("../../controllers/quote/createQuote");
const getAllQuotes = require("../../controllers/quote/getAllQuotes");
const getMyQuotes = require("../../controllers/quote/getMyQuotes");
const getQuote = require("../../controllers/quote/getQuote");
const updateQuote = require("../../controllers/quote/updateQuote");
const getQuoteCount = require("../../controllers/quote/getQuoteCount");

router.post("/", validateAccessToken, createQuote);
router.get("/", validateAccessToken, getAllQuotes);
router.get("/myQuotes", validateAccessToken, getAllQuotes);
router.get("/agent", validateAccessToken, getMyQuotes);
router.get("/count", validateAccessToken, getQuoteCount);
router.get("/:id", validateAccessToken, getQuote);
router.put("/:id", validateAccessToken, updateQuote);

module.exports = router;
