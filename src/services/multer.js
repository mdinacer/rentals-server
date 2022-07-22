const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads');
  },
  filename: function (req, file, callback) {
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.')
    );
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${req.user._id}-${uniqueSuffix}${extension}`);
  },
  // fullPath: function (req, file, callback) {
  //   const host = req.host;
  //   const filePath = req.protocol + '://' + host + '/' + req.file.path;
  //   callback(null, filePath);
  // },
});

const uploadDisk = multer({ storage: storage });
const uploadMemory = multer();

module.exports.UploadDisk = uploadDisk;
module.exports.UploadMemory = uploadMemory;
