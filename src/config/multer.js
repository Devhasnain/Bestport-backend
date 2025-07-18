const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const config = require("../config");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ProductsImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bestport/products",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const ProductsImageUploader = multer({ storage: ProductsImageStorage }).single(
  "image"
);

module.exports = {
    ProductsImageUploader
}