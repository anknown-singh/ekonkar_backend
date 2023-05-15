const router = require("express").Router();

// import routes and middlewares
const authRoutes = require("./Auth.route");
const miscellaneousRoutes = require("./Miscellaneous.route");
const inventoryRoutes = require("./Inventory.route");
const quoteRoutes = require("./Quote.route");
const catalogueRoutes = require("./Catalogue.route");
const cartRoutes = require("./Cart.route");
const orderRoutes = require("./Order.route");
const userRoutes = require("./User.route");
const notificationRoutes = require("./Notification.route.js");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/image", miscellaneousRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/quote", quoteRoutes);
router.use("/catalogue", catalogueRoutes);
router.use("/order", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/notification", notificationRoutes);

// test route
router.get("/test", validateAccessToken, (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

router.get("/ping", (req, res) => {
  res.json({ success: "true", message: "successful request" });
});

module.exports = router;
