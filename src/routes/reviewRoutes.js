const { createReview } = require("../controllers/reviewController");
const { authMiddleware, dtoValidator } = require("../middlewares");
const reviewDto = require("../validators/review");

const router = require("express").Router();
router.use(authMiddleware);
router.post("/create",reviewDto,dtoValidator,createReview);

module.exports = router;