const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|avif)$/i)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      })
      .end()

    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
  }
})
