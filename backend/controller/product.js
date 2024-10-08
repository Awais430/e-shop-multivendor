const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;

// const { upload } = require("../multer");
const order = require("../model/order");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
// create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop id is invalid", 400));
      }

      const files = req.files;
      const imageUrls = [];

      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "product-images", // Folder in Cloudinary to store the images
            },
            (error, result) => {
              if (error) {
                return reject(new ErrorHandler(error.message, 500));
              }
              resolve(result);
            }
          );
          uploadStream.end(file.buffer); // Using the buffer to upload directly
        });

        imageUrls.push({
          url: result.secure_url,
          public_id: result.public_id, // Store the public ID for potential future use
        });
      }

      const productData = req.body;
      productData.images = imageUrls; // Assign Cloudinary URLs to the product
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  })
);

router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      // console.log(products);
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);
// delete product of  a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      // console.log("productId", productId);
      const product = await Product.findByIdAndDelete(productId);
      // console.log("product", product);
      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }
      res.status({
        success: true,
        message: "product delete successfully ",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      // console.log(products)
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// router.put(
//   "/create-new-review",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       console.log(req.body);
//       const { user, rating, comment, productId, orderId } = req.body;

//       const product = await Product.findById(productId);

//       const review = {
//         user,
//         rating,
//         comment,
//         productId,
//       };

//       const isReviewed = product.reviews.find(
//         (rev) => rev.user._id === req.user._id
//       );

//       if (isReviewed) {
//         product.reviews.forEach((rev) => {
//           if (rev.user._id === req.user._id) {
//             (rev.rating = rating), (rev.comment = comment), (rev.user = user);
//           }
//         });
//       } else {
//         product.reviews.push(review);
//       }

//       let avg = 0;

//       product.reviews.forEach((rev) => {
//         avg += rev.rating;
//       });

//       product.ratings = avg / product.reviews.length;

//       await product.save({ validateBeforeSave: false });

//       await order.findByIdAndUpdate(
//         orderId,
//         { $set: { "cart.$[elem].isReviewed": true } },
//         { arrayFilters: [{ "elem._id": productId }], new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Reviwed succesfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// all products --- for admin
// router.get(
//   "/admin-all-products",
//   isAuthenticated,
//   isAdmin("Admin"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.find().sort({
//         createdAt: -1,
//       });
//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;
