import axios from 'axios';

const AuthApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVICE_URL}/`,
    headers: {
        'content-type': 'application/json',
    },
});

AuthApi.interceptors.request.use((config) => {
    // Handle token here ...
    const oauthToken = window.localStorage.getItem('token') || '';
    try {
        const token = JSON.parse(oauthToken)?.access_token;
        // @ts-ignore
        config.headers = {
            'Authorization': `Bearer ${token}`,
        }
    } catch (error) {
        window.localStorage.removeItem('token');
    }
    return config
})

AuthApi.interceptors.response.use((response) => {
    if (response?.data) {
        return response.data
    }
    return response
}, (error) => {
    // Handle errors
    throw error
})

const PublicApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVICE_URL}/`,
    // paramsSerializer: params => queryString.stringify(params),
});

PublicApi.interceptors.response.use((response) => {
    if (response?.data) {
        return response.data
    }
    return response
}, (error) => {
    // Handle errors
    throw error
})

export {
    AuthApi,
    PublicApi,
};
