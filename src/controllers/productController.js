const { Product } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");
const { cloudinary } = require("../config/multer");

exports.createProduct = async (req, res) => {
  try {
    let file = req.file;
    const product = await Product.create({ ...req.body, image: file });
    sendSuccess(res, "New product created successfully.", product, 200);
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id?.trim()?.length) {
      throw new Error("Product id is required");
    }
    const product = await Product.findById(id);
    sendSuccess(res, "New product created successfully.", product, 200);
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.editProduct = async (req, res) => {
  try {
    let file = req.file;
    const id = req.query.id;
    if (!id?.trim()?.length) {
      throw new Error("Product id is required");
    }
    const product = await Product.findById(id);
    if (file) product.image = file;

    let updatedProduct = await product.save();
    sendSuccess(
      res,
      "Product updated successfully.",
      { product: updateProduct },
      200
    );
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id?.trim()?.length) {
      throw new Error("Product id is required");
    }

    const product = await Product.findById(id);

    if (product?.image) {
      await cloudinary.api.delete_resources([product?.image?.filename], {
        resource_type: "image",
        type: "upload",
      });
    }

    await Product.findByIdAndDelete(id);

    sendSuccess(
      res,
      "Product deleted successfully.",
      { },
      200
    );
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(req?.query ?? {});
    sendSuccess(res, "", products, 200);
  } catch (error) {
    return sendError(res, err.message);
  }
};
