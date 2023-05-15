const router = require("express").Router();

// bring in controllers

const updateUser = require("../../controllers/user/updateUser.js");
const updateMyUser = require("../../controllers/user/updateMyUser.js");
const getStaff = require("../../controllers/user/getStaff");
const myUserData = require("../../controllers/user/myUserData");
const validateAccessToken = require("../../middlewares/jwt_validation");
const registerUser = require("../../controllers/auth/register");
const getAgentTaskCount = require("../../controllers/user/getAgentTaskCount.js");
const testScript = require("../../controllers/user/testScript.js");

// update user
router.get("/getStaff", validateAccessToken, getStaff);
router.post("/updateUser", validateAccessToken, updateUser);
router.put("/updateMyUser", validateAccessToken, updateMyUser);
router.get("/myUserData", validateAccessToken, myUserData);
router.get("/count", validateAccessToken, getAgentTaskCount);
router.post("/createUser", validateAccessToken, registerUser);
router.put("/disabled", validateAccessToken, testScript);

module.exports = router;
