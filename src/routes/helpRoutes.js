const {
  createHelpRequest,
  getHelpRequests,
} = require("../controllers/helpRequestController");
const { authMiddleware } = require("../middlewares");
const dtoValidator = require("../middlewares/dtoValidator");
const { helpRequestDto } = require("../validators/help-request");

const router = require("express").Router();
router.use(authMiddleware);
router.post("/create", helpRequestDto, dtoValidator, createHelpRequest);
router.get("/all", getHelpRequests);
module.exports = router;
