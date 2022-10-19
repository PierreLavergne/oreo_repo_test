import axios from "axios";

namespace Google {
    
    export const getGoogleMail =async (access_token: string): Promise<string> => {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
        return response.data.email;
    };
};


export default Google;