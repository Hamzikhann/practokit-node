function fileUpload(dest) {
    const multer = require('multer');
    
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads/${dest}`);
        },
        filename: (req, file, cb) => {
            let fileName = file.originalname.split(' ').join('-');
            cb(null, Date.now().toString() + '-' + fileName);
        }
    });
    const upload = multer({ storage: fileStorage }); 
    return ({
        upload: upload
    });
} 
module.exports = fileUpload;