const router = require("express").Router();

// bring in controllers
const upload = require("../../controllers/miscellaneous/upload");
const uploadtoaws = require("../../controllers/miscellaneous/uploadtoaws");

// login user
router.post("/uploadImage", upload);
router.post("/uploadtoaws", uploadtoaws);

module.exports = router;
