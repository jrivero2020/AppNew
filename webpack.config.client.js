const path = require('path')
const webpack = require('webpack')

const CURRENT_WORKING_DIR = process.cwd()

const webpackConfig = {
    name: "browser",
    mode: "development",
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(CURRENT_WORKING_DIR, '/client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR, '/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        
        rules: [
            {
                test: /\.(js|tsx|ts|jsx)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png|pdf)(\?[\s\S]+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", ],
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }, extensions: ['.js', '.jsx']
    }
}


module.exports = webpackConfig
