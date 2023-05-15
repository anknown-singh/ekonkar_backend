const router = require("express").Router();
const passport = require("passport");

// bring in controllers
const registerUser = require("../../controllers/auth/register");
const loginUser = require("../../controllers/auth/login");
const authUser = require("../../controllers/auth/auth");
const validateJWT = require("../../controllers/auth/validateJWT");
const logoutUser = require("../../controllers/auth/logout");
const verifyUser = require("../../controllers/auth/verify");
const requestResetPassword = require("../../controllers/auth/requestResetPassword");
const resetForgotPassword = require("../../controllers/auth/resetForgotPassword");
const validateContact = require("../../controllers/auth/validateContact");

// login user
router.post("/", authUser);
router.post("/login", loginUser);
router.post("/validateJWT", validateJWT);

// logout user
router.delete("/logout", logoutUser);

// verify email
router.post("/verify", verifyUser);

// register a user
router.post("/register", registerUser);

router.post("/requestResetPassword", requestResetPassword);
router.post("/resetPassword", resetForgotPassword);

// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get("/:value", validateContact);

// /api/auth/google/callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   oAuthLogin
// );

// /api/auth/verify-oauth
// router.post("/verify-oauth", oAuthVerify);

module.exports = router;
