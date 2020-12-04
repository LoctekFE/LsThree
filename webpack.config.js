const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const port = 9000

version = '0.0.1'

let plugins = [
    new WebpackBar()
]

if (process.env.NODE_ENV === 'development') {
    plugins.push(
        new HtmlWebpackPlugin({
            template: './src/example/index.html'
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`You application is running here http://localhost:${port}`, 'file: ./src/example'],
                notes: []
            },
            // should the console be cleared between each compilation?
            // default is true
            clearConsole: true,
    
            // add formatters and transformers (see below)
            additionalFormatters: [],
            additionalTransformers: []
        })
    )
}


module.exports = {
    entry: process.env.NODE_ENV === 'development' ? './src/example/index.ts' : './src/build/index.ts',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.d.ts']
    },
    output: {
        filename: `LsThree-${version}.min.js`
    },
    mode: process.env.NODE_ENV,
    performance: {
        hints: false,
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: plugins,
    stats: 'errors-only',
    devServer: {
        port: port,
    }
}
