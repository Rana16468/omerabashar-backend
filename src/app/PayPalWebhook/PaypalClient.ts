import axios from 'axios';
import config from '../config';

 
export const paypalAccount = config.paypal.mode === 'sandbox' ? {clientId:config.paypal.client_id,clientSecret: config.paypal.client_secret,baseUrl: config.paypal.base_url} : {};
 
export const getPaypalAccessToken = async () => {
    const credentials = Buffer.from(`${paypalAccount.clientId}:${paypalAccount.clientSecret}`).toString('base64');
 
    const response = await axios.post(`${paypalAccount.baseUrl}/v1/oauth2/token`, `grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
 
    return response.data.access_token;
};