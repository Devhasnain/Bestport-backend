const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.use(authMiddleware);

router.post('/create',authMiddleware, )

module.exports = router;