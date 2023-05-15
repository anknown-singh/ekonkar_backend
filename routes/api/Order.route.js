const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const placeMoodboardOrder = require("../../controllers/order/placeMoodboardOrder");
const placeCartOrder = require("../../controllers/order/placeCartOrder");
const placeSingleCatalogueOrder = require("../../controllers/order/placeSingleCatalogueOrder");
const getMyOrders = require("../../controllers/order/getMyOrders");
const getAllOrders = require("../../controllers/order/getAllOrders");
const getOrderStatusCount = require("../../controllers/order/getOrderStatusCount");
// const getAllCarts = require("../../controllers/quote/getAllCarts");
// const getCart = require("../../controllers/quote/getCart");
// const updateCart = require("../../controllers/quote/updateCart");
// const updateCartStatus = require("../../controllers/quote/updateCartStatus");
// const createCartStatus = require("../../controllers/quote/createCartStatus");

router.get("/", validateAccessToken, getAllOrders);
router.post("/moodboardOrder", validateAccessToken, placeMoodboardOrder);
router.post(
  "/singleCatalogueOrder",
  validateAccessToken,
  placeSingleCatalogueOrder
);
router.post("/cartOrder", validateAccessToken, placeCartOrder);
router.get("/myOrders", validateAccessToken, getMyOrders);
router.get("/count", validateAccessToken, getOrderStatusCount);
// router.get("/", getAllCarts);
// router.get("/:id", getCart);
// router.put("/:id", updateCart);
// router.put("/status/:id", updateCartStatus);
// router.post("/status", createCartStatus);

module.exports = router;
