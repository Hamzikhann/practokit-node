function fileUpload(dest) {
	const multer = require("multer");

	const fileStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `./uploads/${dest}`);
		},
		filename: (req, file, cb) => {
			let fileName = file.originalname.split(" ").join("-");
			cb(null, Date.now().toString() + "-" + fileName);
		}
	});
	// multer.memoryStorage()
	const upload = multer({ storage: multer.memoryStorage() });
	return {
		upload: upload
	};
}
module.exports = fileUpload;
