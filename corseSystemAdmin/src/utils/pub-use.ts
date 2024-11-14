// 获取assets静态资源
export const getImg=(name: string) =>{
    return new URL(`../assets/img/${name}`, import.meta.url).href;
}
