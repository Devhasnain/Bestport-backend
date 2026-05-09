const { authMiddleware } = require("../middlewares");

const router = require("express").Router();
const { getInvoices, getSingleInvoice} = require("../controllers/invoiceController");

router.use(authMiddleware);

router.get("/all", getInvoices);
router.get('/:id',getSingleInvoice)

module.exports = router;