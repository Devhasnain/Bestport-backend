const router = require("express").Router();
const { checkAccessKey } = require("../middlewares");
const authRoutes = require("./authRoutes");
router.use(checkAccessKey)
router.use("/auth",authRoutes);
module.exports= router;