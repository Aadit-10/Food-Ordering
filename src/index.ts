import express from "express";
import bodyParser from "body-parser";
import BaseRouter from './routes'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/base', BaseRouter)

app.listen(3000, () => {
    console.log("App is listening at port 3000");
});