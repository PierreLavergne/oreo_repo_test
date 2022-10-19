import Api from "./api";
import dotenv from "dotenv";

dotenv.config();

const api: Api = new Api({
    method: process.env.METHODE,
    host: process.env.HOST,
    port: Number.parseInt(String(process.env.PORT)),
});


api.initDb().then(() => api.run());
