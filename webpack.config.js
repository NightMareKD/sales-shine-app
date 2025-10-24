const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Start from renderer/index.js
    entry: './src/renderer/index.js',
    
    // Output bundled file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'renderer.js',
    },
    
    // Target Electron renderer process
    target: 'electron-renderer',
    
    // Module rules (how to handle different file types)
    module: {
        rules: [
            // JavaScript/JSX files - use Babel
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            // CSS files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    // Plugins
    plugins: [
        // Injects our bundled JS into index.html
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        })
    ],
    
    // Resolve file extensions
    resolve: {
        extensions: ['.js', '.jsx']
    },
    
    // Development mode (shows readable errors)
    mode: 'development',
    
    // Source maps for debugging
    devtool: 'source-map'
};