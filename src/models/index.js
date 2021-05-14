let files = require.context('./modules', false, /\.js$/)

let modules = files.keys().reduce((modules, path) => {
    let value = files(path)
    let name = path.replace(/^\.\/(.*)\.\w+$/, '$1')
    value = value.default
    const clazz = value.name
    if (modules[clazz] === undefined) {
        modules[clazz] = value
    } else {
        console.error(`Model 模块类名: ${clazz} 已在 ${name} 文件中存在`)
    }
    return modules
}, {})

module.exports = modules
