export const baseUrl = "https://zaloapp.com.vn/";



const API = {
    getEvent: () => baseUrl + "api/get-events",
    checkinEvent: () => baseUrl + "api/store-event",
    convertBase64: () => baseUrl + "api/upload/base64",
    followOA: () => baseUrl + "api/follow-oa-and-list-product",
    checkFollow: () => baseUrl + "api/check-and-list-product",
};

export default API;
