const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const createInventoryProduct = require("../../controllers/inventory/createInventoryProduct");
const updateInventoryProduct = require("../../controllers/inventory/updateInventoryProduct");
const deleteSingleInventory = require("../../controllers/inventory/deleteSingleInventory");
const deleteAttribute = require("../../controllers/inventory/deleteAttribute");
const createInventoryAttribute = require("../../controllers/inventory/createInventoryAttribute");
const updateInventoryAttribute = require("../../controllers/inventory/updateInventoryAttribute");
const updateManyInventoryAttribute = require("../../controllers/inventory/updateManyInventoryAttribute");
const getInventory = require("../../controllers/inventory/getInventory");
const getInventoryAndSubAttributes = require("../../controllers/inventory/getInventoryAndSubAttributes");
const getAttributes = require("../../controllers/inventory/getAttributes");
const testScript = require("../../controllers/inventory/testScript");

// login user
router.get("/", getInventory);
router.get("/inventoryandsubattributes", getInventoryAndSubAttributes);
router.post("/product", validateAccessToken, createInventoryProduct);
router.put("/product", validateAccessToken, updateInventoryProduct);
router.delete("/product/:id", validateAccessToken, deleteSingleInventory);
router.delete("/attribute/:id", validateAccessToken, deleteAttribute);
router.post("/attribute", validateAccessToken, createInventoryAttribute);
router.put("/attribute", validateAccessToken, updateInventoryAttribute);
router.put("/attributeMany", validateAccessToken, updateManyInventoryAttribute);
router.get("/attribute", validateAccessToken, getAttributes);
router.put("/test", validateAccessToken, testScript);

module.exports = router;
