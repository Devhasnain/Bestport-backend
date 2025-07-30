const {
  createProduct,
  getProductById,
  editProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const dtoValidator = require("../middlewares/dtoValidator");
const createProductDto = require("../validators/product");

const router = require("express").Router();
router.use(authMiddleware);

router.post(
  "/create",
  authMiddleware,
  createProductDto,
  dtoValidator,
  createProduct
);
router.get(
  "/edit",
  authMiddleware,
  createProductDto,
  dtoValidator,
  editProduct
);
router.post("/delete", authMiddleware, deleteProduct);
router.post("/all", authMiddleware, getAllProducts);
router.get("/", authMiddleware, getProductById);

module.exports = router;
