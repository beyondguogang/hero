module.exports = {
    pwa: {
        iconPaths: {
            favicon32: 'g.svg',
            favicon16: 'g.svg',
            appleTouchIcon: 'g.svg',
            maskIcon: 'g.svg',
            msTileImage: 'g.svg'
        }
    },
    lintOnSave: false,
    plugins: {
        'autoprefixer': {
          browsers: ['Android >= 4.0', 'iOS >= 7']
        },
        'postcss-pxtorem': {
          rootValue: 37.5,
          propList: ['*']
        }
      }
}