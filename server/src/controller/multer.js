const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images');
      },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ //multer settings
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    //       cb(null, true);
    //     } else {
    //       cb(null, false);
    //       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //     }
    // }
})

module.exports = upload;