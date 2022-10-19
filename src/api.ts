import { Express } from "express-serve-static-core";
import informations from "./routes/information";
import verify from "./routes/verify";
import applet from './routes/applet'
import Logger from './utils/logger';
import { initPool } from "./db/db";
import auth from "./routes/auth";
import express from 'express';
import https from 'https';
import fs from 'fs';
import checkJwt from "./routes/middlewares/jwt";

interface ApiOption {
    port?: number;
    host?: string;
    method?: string;
};

const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

const defaultApiOption: ApiOption = {
    port: 5000,
    host: "127.0.0.1",
    method: "https",
};

class Api {
    private setHeaders(): void {
        this._app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization');
            res.setHeader('Access-Control-Allow-Credentials', "true");
            next();
        });
    }
    constructor(options?: ApiOption) {
        this.port = options !== undefined ? options.port || defaultApiOption.port! : defaultApiOption.port!;
        this.host = options !== undefined ? options.host || defaultApiOption.host! : defaultApiOption.host!;
        this.method = options !== undefined ? options.method || defaultApiOption.method! : defaultApiOption.method!;
        this._app = express();
        this._app.use(express.json());
        this.setHeaders();
        this._app.use(Logger.routesLogging);
        this.applyRoutes();
        this._server = https.createServer({key: key, cert: cert}, this._app);
    }

    private sleep(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }      

    public async initDb(): Promise<void> {
        Logger.log("Try to connect to db", "yellow")
        return new Promise(async (resolve, reject) => {
            let isConnected: boolean = false;
            do {
                try {
                    await initPool();
                    isConnected = true;
                } catch(e) {
                    Logger.log("Failed to connect to the database. Retry in 5 seconds.", "yellow");
                    await this.sleep(5000);   
                }
            } while (!isConnected);
            Logger.log("Database connected !", "green");
            return resolve();
        });
    }
    
    private applyRoutes(): void {
        this._app.get("/health", (req, res) => res.status(200).send("Up"));
        this._app.use("/auth", auth);
        this._app.use("/verify", verify);
        this._app.use("/info", checkJwt, informations);
        this._app.use("/applet", checkJwt, applet);
        this._app.use("*", (req, res) => res.status(404).send("Not found"));
        this._app.post("/test", (req, res) => {
            
        })
    }

    public run(): void {
        this._server.listen(this.port, () => Logger.serverStart(this._app, this.method, this.host, this.port));
    }
    
    private readonly port: number;
    private readonly host: string;
    private readonly method: string;
    private readonly _app: Express;
    private readonly _server: https.Server;
    public get app(): https.Server {
        return this._server;
    }
};

export default Api;