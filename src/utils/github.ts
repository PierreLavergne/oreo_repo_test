import axios from "axios";
import { selectAccessTokenByClientId } from "../db/queries/oauth2";
import Oauth2User from "../models/oauth2User";
import Logger from "./logger";

namespace Github {
    export const getAccessToken = async (user_id: string): Promise<string> => {
        let oauth2User: Oauth2User;

        try {
            oauth2User = await selectAccessTokenByClientId(user_id);
        } catch (err: any) {
            Logger.mysqlError(err);
            return '';
        }
        return oauth2User.access_token;
    };

    export const getUsername = async (access_token: string): Promise<string> => {
        try {
            const infos = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            });
            return infos.data["login"];
        } catch (err) {
            return "";
        }
    };
};

export default Github;