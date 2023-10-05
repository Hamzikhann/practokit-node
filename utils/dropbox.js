const Dropbox = require("dropbox").Dropbox;
const fs = require("fs");
const fetch = require("isomorphic-fetch");
const { file } = require("googleapis/build/src/apis/file");
const { error } = require("console");
const moment = require("moment");

const dbx = new Dropbox({ accessToken: process.env.ACCESS_TOKEN, fetch: fetch });

const uploadMultipleImages = async (files) => {
	const uploadedImages = [];

	if (typeof files == "undefined") {
		return undefined;
	} else {
		for (const file of files) {
			const fileContent = fs.readFileSync(file.path);

			try {
				const datetime = moment().format("YYMMDDHHmmss");
				const response = await dbx.filesUpload({
					path: `/images/${datetime}-${file.originalname}`,
					contents: fileContent
				});

				uploadedImages.push(response.result);
				fs.unlinkSync(file.path);
			} catch (error) {
				console.error(error);
			}
		}
		return uploadedImages;
	}
};
const downloadImage = async (url) => {
	const response = await dbx.filesDownload({ path: `${url}` });
	return response;
};

module.exports = { uploadMultipleImages, downloadImage };
