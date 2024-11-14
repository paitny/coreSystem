import request from "../utils/request";

export const getRoute = async () => {
    try {
        const response = await request({
            url: '/api/adminServer/get/route'
        });
        return response;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
};
