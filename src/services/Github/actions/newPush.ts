import axios from "axios";
import GithubUtils from '../../../utils/github'

namespace Github {
    export const newPush = async (client_id: string, repository_name: string): Promise<void> => {
        const access_token: string = await GithubUtils.getAccessToken(client_id);
        const owner_name: string = await GithubUtils.getUsername(access_token);

        const url: string = `https://api.github.com/repos/${owner_name}/${repository_name}/hooks`;

        try {
            const t = await axios.post(url, {
                name: "web",
                config: { url: "https://127.0.0.1:5000/test", content_type: "json", insecure_ssl: "1" },
                events: [ "push" ],
                active: true
            }, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: 'Bearer ' + access_token
                }
            });
            console.log(t);
        } catch (err) {
            console.log(err);
        }
    };
};

export default Github;