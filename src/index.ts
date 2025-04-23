import express from "express";
import bodyParser from "body-parser";
import BaseRouter from './routes'
import { connectDb } from "./config/database";
import path from 'path'

const app = express();

connectDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/base', BaseRouter)

app.listen(3000, () => {
    console.log("App is listening at port 3000");
});