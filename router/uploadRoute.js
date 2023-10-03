

import express from 'express'
import { v2 as cloudinary } from 'cloudinary'


const router = express.Router()
// Configuration 
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto'
}

// Upload
const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            console.log(error.message);
            return reject({ message: error.message });
        });
    });
};



router.post('/', (req, res) => {
    uploadImage(req.body.image)
        .then((url) => {
            res.send(url)
        }).
        catch((error) => res.status(500).send(error))
})


export default router




