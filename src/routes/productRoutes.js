const { ProductsImageUploader } = require("../config/multer");
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
  ProductsImageUploader,
  createProductDto,
  dtoValidator,
  createProduct
);
router.put(
  "/edit",
  authMiddleware,
  ProductsImageUploader,
  createProductDto,
  dtoValidator,
  editProduct
);
router.delete("/delete", authMiddleware, deleteProduct);
router.get("/all", authMiddleware, getAllProducts);
router.get("/", authMiddleware, getProductById);

module.exports = router;
