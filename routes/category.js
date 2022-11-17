const express = require("express");
const router = express.Router();
const category = require("../controllers/category");
const { verifyToken } = require("../middlewares/auth");
router.get("/allCategory", category.getAllCategory);
router.get("/categoryService/:id", category.getCategoryServices);
router.get("/subcategoryService/:id", category.getSubCategoryServices);
router.get("/subcategory2Service/:id", category.getSubCategory2Services);
module.exports = router;
