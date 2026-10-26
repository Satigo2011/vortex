const multer = require("multer");

const tipos = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (tipos[file.mimetype]) return cb(null, true);
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  },
});

module.exports = upload;