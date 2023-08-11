const { resolve } = require('path');


module.exports = {
  webpack: {
    configure: {
      module: {
          rules: [
              {
                  test: /\.m?js$/,
                  resolve: {
                      fullySpecified: false,
                  },
              },
          ],
      },
  },
    alias: {
        'containers': resolve('src/containers'),
        'components': resolve('src/components'),
        'libs': resolve('src/libs'),
        'utils': resolve('src/utils'),
        'styles': resolve('src/styles'),
        'layout': resolve('src/layout'),
        'context': resolve('src/context'),
    },
  },
};