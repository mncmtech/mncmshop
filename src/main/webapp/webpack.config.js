var path    = require('path');
var webpack = require('webpack');
module.exports = {
  entry : './scripts/webpack/initializer.js',
  output: {
    path : __dirname+"/dist",
    filename : 'signup.bundle.js'
  },
  module : {
    loaders : [{
      test: path.join(__dirname,'scripts'),
      loader:'babel-loader'
    },
    {
      test: path.join(__dirname,'scripts/webpack'),
      exclude: /(test|node_modules|bower_components)/,
      loader: 'istanbul-instrumenter-loader'
    }

  ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery:'jquery'
    })
  ]
}
