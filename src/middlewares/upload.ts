import multer from "multer";
import { messages } from "../common/constants";
import { customError, sendResponse } from "../utils";
import path from 'path';
import fs from 'fs';


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        const imageDirectory = path.join(__dirname, '../images');

        if (!fs.existsSync(imageDirectory)) {
            fs.mkdirSync(imageDirectory, { recursive: true });
        }

        cb(null, imageDirectory);
    }, filename: function (req, file, cb) {
        const fileName = new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname;
        cb(null, fileName);
    }
})

export const upload = multer({ storage: imageStorage }).array('images', 10)