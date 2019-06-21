const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  local: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, callback) => {
      // callback(null, file.originalname);
      crypto.randomBytes(16, (error, hash) => {
        if (error) callback(error);
        file.image = `${hash.toString("hex")}-${file.originalname}`;
        callback(null, file.image);
      });
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        console.log(file);
        if (error) callback(error);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        callback(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  }
};
