const express = require("express");
const router = express.Router();
const category = require("../controllers/category");
const { verifyToken } = require("../middlewares/auth");

router.get("/allCategory", category.getAllCategory);
router.get("/categoryService/:id", category.getCategoryServices);
router.get("/subcategoryService/:id", category.getSubCategoryServices);
router.get("/subcategory2Service/:id", category.getSubCategory2Services);

//user rate service
router.post("/rateSilver", category.rateSilver);
router.post("/rateGold", category.rateGold);
router.post("/ratePlatinum", category.ratePlatinum);
router.put("/rateSilver", category.updateRateSilver);
router.put("/rateGold", category.updateRateGold);
router.put("/ratePlatinum", category.updateRatePlatinum);
module.exports = router;
