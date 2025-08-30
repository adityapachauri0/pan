const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Enable source maps for better debugging
        webpackConfig.devtool = 'source-map';
        
        // Optimize chunks
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                enforce: true
              }
            }
          },
          runtimeChunk: {
            name: 'runtime'
          }
        };
      }

      // Resolve aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks')
      };

      return webpackConfig;
    }
  },
  
  // CSS optimization
  style: {
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  },
  
  // Development server configuration
  devServer: {
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true
  }
};