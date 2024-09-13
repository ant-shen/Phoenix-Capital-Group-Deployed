const webpack = require('webpack');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? 'https://phoenix-capital-group-deployed.onrender.com/' // Update this to your actual path if deploying to a subdirectory
  : '/',

outputDir: 'dist',


assetsDir: 'assets',

configureWebpack: {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL),
      },
    }),
  ],
},
  
  devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false
        },
      },
    },
  };


//wihtout cors
/*
module.exports = {
  devServer: {
    proxy: 'http://localhost:5001',
  },
};
*/