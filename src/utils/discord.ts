import axios from "axios";

namespace Discord {
    export const getDiscordMail =async (access_token: string): Promise<string> => {
        const response = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        return response.data.email;
    }
};

export default Discord;