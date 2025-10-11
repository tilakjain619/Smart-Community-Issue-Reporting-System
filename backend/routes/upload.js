const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const cloudinary = require('cloudinary');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Middleware to handle file uploads
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

router.post('/upload', (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send({ msg: "No files were uploaded" });

        // console.log(req.files); 

        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "Size too large" });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect. Use png or jpg/jpeg type" });
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'JagrukImageContainer' }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath);

            res.json({ public_id: result.public_id, url: result.secure_url });
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/destroy', requireAuth(), (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No images Selected" });

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Image Deleted Successfully" });
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    });
}

module.exports = router;