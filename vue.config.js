module.exports = {
  publicPath: './',
  devServer: {
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        ws: false,
        changeOrigin: true // 是否跨域
      }
    }
  }
}
