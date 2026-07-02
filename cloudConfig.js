const cloudinary = require('cloudinary').v2;
// multer-storage-cloudinary v2 exports a function directly, not a CloudinaryStorage class.
const cloudinaryStorage = require('multer-storage-cloudinary');

// configure cloudinary with your credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Cloudinary initialized:");

console.log({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret_present: !!process.env.CLOUD_API_SECRET
});

console.log("Uploader:", cloudinary.uploader);

console.log("Cloudinary config:");
console.log({
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET ? "Present" : "Missing"
});


// v2 syntax: call cloudinaryStorage() directly so deployment does not crash with
// "CloudinaryStorage is not a constructor".
const storage = cloudinaryStorage({
  // This old storage package calls cloudinary.v2.uploader internally,
  // so pass the v2 API in the shape it expects.
  cloudinary: { v2: cloudinary },
  folder: 'barter_DEV',
  allowedFormats:["png","jpg","jpeg"],
});

module.exports = {cloudinary,storage}
