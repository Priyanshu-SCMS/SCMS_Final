const { Storage } = require("@google-cloud/storage");
const path = require("path");
const multer = require("multer");

const storage = new Storage({
  keyFilename: path.join(__dirname, "service-account-key.json"),
});

const bucketName = "smart-campus-files";
const bucket = storage.bucket(bucketName);

const upload = multer({ storage: multer.memoryStorage() });

const uploadFileToGCS = async (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("finish", () => resolve(blob.name));
    blobStream.on("error", reject);
    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadFileToGCS };
