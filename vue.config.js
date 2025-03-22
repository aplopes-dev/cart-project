const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

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

    // Adicionar feature flags do Vue
    config.plugin('define')
      .tap(args => {
        Object.assign(args[0], {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
          // Feature flags do vue-i18n
          __VUE_I18N_FULL_INSTALL__: true,
          __VUE_I18N_LEGACY_API__: true,
          __INTLIFY_DROP_MESSAGE_COMPILER__: false
        })
        return args
      })
  }
})



