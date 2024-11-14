import request from "../utils/request";
export const login=(data:any)=>{
return request({
    url:"/api/login",
    method:"POST",
    data
})

}
// 退出登录接口
export const logout = () => {
    return request({
        url: '/api/login/out',
        method:"POST"
    })
}
// 验证登录接口
export const checkLogin = () => {
    return request({
        url: '/api/login/check',
        method:"POST"
    })
}
//验证是否是管理员
export const checkAdmin = () => {
    return request({
        url: '/api/adminServer/check',
        method:"POST"
    })
}
//验证码
export const checkSvg = () => {
    return request({
        url: '/api/get/getSvg',
        method:"GET",
    })
}
