import path from 'path';
import webpack from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  devtool: 'eval',
  entry: './src/index.js',
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js'],
    alias: {
      '@data': path.resolve(__dirname, 'data')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      d3: 'd3'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin()
  ],
  devServer: {
    hot: true,
    quiet: true,
    inline: true,
    stats: false,
    watchOptions: {poll: 1000, ignored: /node_modules/}
  }
};