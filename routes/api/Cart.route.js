const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const createCartItem = require("../../controllers/cart/createCartItem");
const deleteCartItem = require("../../controllers/cart/deleteCartItem");
const getMyCart = require("../../controllers/cart/getMyCart");
// const getAllCarts = require("../../controllers/quote/getAllCarts");
// const getCart = require("../../controllers/quote/getCart");
// const updateCart = require("../../controllers/quote/updateCart");
// const updateCartStatus = require("../../controllers/quote/updateCartStatus");
// const createCartStatus = require("../../controllers/quote/createCartStatus");

router.post("/", validateAccessToken, createCartItem);
router.delete("/:id", validateAccessToken, deleteCartItem);
router.get("/myCart", validateAccessToken, getMyCart);
// router.get("/", getAllCarts);
// router.get("/:id", getCart);
// router.put("/:id", updateCart);
// router.put("/status/:id", updateCartStatus);
// router.post("/status", createCartStatus);

module.exports = router;
