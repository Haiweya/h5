console.log(process.env.NODE_ENV);
const port = process.env.port || 9999;

const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 
    // (在生产构建时禁用 eslint-loader) 应该是!==,这里设置为===是为了不进行检查
    lintOnSave: process.env.NODE_ENV === 'production',
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
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve(''),
                '@api': resolve('api'),
                '@models': resolve('models'),
                '@stores': resolve('stores'),
                '@assets': resolve('assets'),
                '@router': resolve('router'),
                '@pages': resolve('pages'),
            },
        }
    }
}