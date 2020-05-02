const TerserPlugin = require('terser-webpack-plugin');
const { join } = require('path');
const resolve = function(dir) {
  return join(__dirname, dir);
};

module.exports = {
  pages: {
    index: './src/renderer/main.ts'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        assets: resolve('src/renderer/assets'),
        components: resolve('src/renderer/components'),
        utils: resolve('src/renderer/utils')
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          // test: /\.(js|vue)$/i,
          parallel: true,
          terserOptions: {
            compress: {
              'drop_debugger': true,
              /** 测试阶段暂时启用console */
              // 'drop_console': true,
            },
            warnings: false,
            parallel: true
          }
        })
      ]
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: resolve('src/main/index.ts'),
      configureWebpackMainProcess: {}
    }
  }
};
