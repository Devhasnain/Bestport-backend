const { Product } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");
const { cloudinary } = require("../config/multer");

exports.createProduct = async (req, res) => {
  try {
    let file = req.file;
    if (!file) {
      throw new Error("Product image is required.");
    }
    const product = await Product.create({ ...req.body, image: file });
    sendSuccess(res, "New product created successfully.", { product }, 200);
  } catch (err) {
    if (file && file?.filename) {
      await cloudinary.api.delete_resources([file?.filename], {
        resource_type: "image",
        type: "upload",
      });
    }
    sendError(res, err.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id?.trim()?.length) {
      throw new Error("Product id is required");
    }
    const product = await Product.findById(id);
    sendSuccess(res, "", product, 200);
  } catch (err) {
    sendError(res, err.message);
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

    if (file) {
      await cloudinary.api.delete_resources([product?.image?.filename], {
        resource_type: "image",
        type: "upload",
      });
      product.image = file;
      await product.save();
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    sendSuccess(
      res,
      "Product updated successfully.",
      { product: updatedProduct },
      200
    );
  } catch (err) {
    if (file && file?.filename) {
      await cloudinary.api.delete_resources([file?.filename], {
        resource_type: "image",
        type: "upload",
      });
    }
    sendError(res, err.message);
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

    sendSuccess(res, "Product deleted successfully.", {}, 200);
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let select = req.query?.select?.split(",") ?? [];

    const [products, total] = await Promise.all([
      Product.find({})
        .select(select)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Product.countDocuments({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(
      res,
      "",
      {
        products,
        pagination: {
          total,
          page,
          totalPages,
          limit,
        },
      },
      200
    );
  } catch (error) {
    return sendError(res, err.message);
  }
};
