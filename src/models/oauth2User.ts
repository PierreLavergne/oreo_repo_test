interface Oauth2User {
    id: string,
    service: string,
    access_token: string,
    refresh_token: string,
    expiry_date: number
};

export default Oauth2User;