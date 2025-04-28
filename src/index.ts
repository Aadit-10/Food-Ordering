import express from "express";
import { connectDb } from "./config/database";
import App from './config/ExpressApp'

const StartServer = async () => {
    const app = express();
    connectDb();
    await App(app);

    app.listen(3000, () => {
        console.log("App is listening at port 3000");
    });
}

StartServer()