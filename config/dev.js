console.log(process.env.NODE_ENV);
const port = process.env.port || 9999;
module.exports = {
    devServer: {
        port,
        open: true,
        // 前端应用和后端 API 服务器没有运行在同一个主机上，
        // 你需要在开发环境下将 API 请求代理到 API 服务器
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: "http://localhost:8000/mock", // 接口的域名
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                pathRewrite: {
                    [process.env.VUE_APP_BASE_API]: ""
                }
            }
        }
    },
    chainWebpack(config) {
        // 开发模式下去掉预加载和预请求的优化
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
}