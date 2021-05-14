const merge = require('webpack-merge')
const dev = require('./dev')
const prod = require('./prod')

const path = require('path');

const resolve = (dir) => {
    let root = `${__dirname}/../src`
    return path.join(root, dir)
}

const common = {
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 
    // (在生产构建时禁用 eslint-loader) 应该是!==,这里设置为===是为了不进行检查
    lintOnSave: process.env.NODE_ENV === 'production',

    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve(''),
                '@stores': resolve('stores'),
                '@assets': resolve('assets'),
                '@router': resolve('router'),
                '@views': resolve('views'),
                '@utils': resolve('utils'),
            },
        }
    }
}
let isDev = process.env.NODE_ENV === 'development'
let target = isDev ? dev : prod
module.exports = merge({}, common, target)