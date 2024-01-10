import axios from "axios";

const REQUEST_API = async ({ url, method, data }) => {
    // const CurrentUser = await AsyncStorage.getItem(ASYN.SAVE_DATA_USER);
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    const config = { method, url, data, headers };

    try {
        const res = await axios(config);
        if (res.status === 200) {
            return res.data;
        }
    } catch (e) {
        if (String(e).indexOf("Network Error") !== -1) {
            throw new Error("Không có internet");
        }
        else {
            // AlertOnly(e.message);
            throw new Error(e);
        }
    }
};

export { REQUEST_API };
