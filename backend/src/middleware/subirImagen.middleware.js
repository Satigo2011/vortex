const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const carpeta = path.join(__dirname, "../../uploads");
fs.mkdirSync(carpeta, { recursive: true });

const tipos = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpeta),
  // nombre aleatorio: nunca se usa el nombre que manda el usuario
  filename: (req, file, cb) =>
    cb(null, crypto.randomUUID() + tipos[file.mimetype]),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (tipos[file.mimetype]) return cb(null, true);
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  },
});

module.exports = upload;