const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
const getMyNotifications = require("../../controllers/notification/getMyNotifications");
const createNotification = require("../../controllers/notification/createNotification");

router.get("/", validateAccessToken, getMyNotifications);
router.post("/", validateAccessToken, createNotification);

module.exports = router;
