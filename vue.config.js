const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '~': __dirname + '/src/assets'
      }
    },
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: [
          '/',
          '/dieu-khien',
          '/ket-qua',
          '/ha-noi',
          '/da-nang',
          '/quay-so/hn/1',
          '/quay-so/hn/2',
          '/quay-so/hn/3',
          '/quay-so/dn/1',
          '/quay-so/dn/2',
          '/quay-so/dn/3',
          '/quay-so/hn/4',
          '/quay-so/hn/5',
          '/quay-so/dn/4',
          '/quay-so/dn/5',
          '/quay-so/hn-guest/1',
          '/quay-so/dn-guest/1',
          '/dang-ky/hn',
          '/dang-ky/dn',
          'lixi/hn',
          'lixi/dn',
        ]
      })
    ]
  }
};
