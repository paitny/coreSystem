import axios from "axios"
const URL = process.env.NODE_ENV === "development" ? '/api' : ''
const service=axios.create({
    timeout: 5000,
    withCredentials: true,
     baseURL: URL

})
export default service
