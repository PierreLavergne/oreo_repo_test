import type { Response, Request, NextFunction, Express } from "express";
import { QueryError } from "mysql2";

type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

class Logger {
    private static readonly Reset: string = "\x1b[0m";
    private static readonly Bright: string = "\x1b[1m";
    private static readonly Dim: string = "\x1b[2m";
    private static readonly Underscore: string = "\x1b[4m";
    private static readonly Blink: string = "\x1b[5m";
    private static readonly Reverse: string = "\x1b[7m";
    private static readonly Hidden: string = "\x1b[8m";

    private static readonly Black: string = "\x1b[30m";
    private static readonly Red: string = "\x1b[31m";
    private static readonly Green: string = "\x1b[32m";
    private static readonly Yellow: string = "\x1b[33m";
    private static readonly Blue: string = "\x1b[34m";
    private static readonly Magenta: string = "\x1b[35m";
    private static readonly Cyan: string = "\x1b[36m";
    private static readonly White: string = "\x1b[37m";

    private static readonly BgBlack: string = "\x1b[40m";
    private static readonly BgRed: string = "\x1b[41m";
    private static readonly BgGreen: string = "\x1b[42m";
    private static readonly BgYellow: string = "\x1b[43m";
    private static readonly BgBlue: string = "\x1b[44m";
    private static readonly BgMagenta: string = "\x1b[45m";
    private static readonly BgCyan: string = "\x1b[46m";
    private static readonly BgWhite: string = "\x1b[47m";

    private static getColor(color?: Color): String {
        switch (color) {
            case "black":
                return this.Black;
            case "red":
                return this.Red;
            case "green":
                return this.Green;
            case "yellow":
                return this.Yellow;
            case "blue":
                return this.Blue;
            case "magenta":
                return this.Magenta;
            case "cyan":
                return this.Cyan;
            default:
                return this.White;
        }
    }

    private static getBackgroundColor(color?: Color) {
        switch (color) {
            case "black":
                return this.BgBlack;
            case "red":
                return this.BgRed;
            case "green":
                return this.BgGreen;
            case "yellow":
                return this.BgYellow;
            case "blue":
                return this.BgBlue;
            case "magenta":
                return this.BgMagenta;
            case "cyan":
                return this.BgCyan;
            case "white":
                return this.BgWhite;
            default:
                return "";
        }    
    }

    public static log(message: string, color?: Color, backgroundColor?: Color): void {
        console.log(`${this.getColor(color)}${this.getBackgroundColor(backgroundColor)}${message}${this.Reset}`);
    };

    public static routesLogging(req: Request, res: Response, next: NextFunction): void {
        const url: string = req.url;

        console.log(`[${req.ip.split(":")[3]}] ${req.method}: ${url}`);
        res.on("finish", () => Logger.log(`[${req.ip.split(":")[3]}] ${req.method}: ${url} ${res.statusCode}`, res.statusCode >= 400 ? "red" : "green"));
        next();
    };

    public static mysqlError(error: QueryError): void {
        Logger.log(error.message, "red");
    };

    public static serverStart(server: Express, method: string, host: string, port: number): void {
        console.log(`Server run on ${method}://${host}:${port}`);
    }
}

export default Logger;