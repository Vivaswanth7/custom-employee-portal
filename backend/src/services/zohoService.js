const axios = require("axios");

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
            null,
            {
                params: {
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    grant_type: "refresh_token"
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error(
            "Zoho token error:",
            error.response?.data || error.message
        );

        throw new Error("Unable to get Zoho access token");
    }
};

const getBooksOrganizations = async () => {
    const accessToken = await getAccessToken();

    const response = await axios.get(
        `${process.env.ZOHO_API_DOMAIN}/books/v3/organizations`,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`
            }
        }
    );

    return response.data;
};

const getBooksOrganization = async (organizationId) => {
    const accessToken = await getAccessToken();

    const response = await axios.get(
        `${process.env.ZOHO_API_DOMAIN}/books/v3/organizations/${organizationId}`,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`
            }
        }
    );

    return response.data;
};

module.exports = {
    getAccessToken,
    getBooksOrganizations,
    getBooksOrganization
};