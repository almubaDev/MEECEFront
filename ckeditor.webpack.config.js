const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/ckeditor/CustomEditor.js'),
    output: {
        path: path.resolve(__dirname, 'src/build'),
        filename: 'ckeditor.js',
        library: 'CustomEditor',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig({
                                themeImporter: {
                                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                                },
                                minify: true
                            })
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        test: /object-size-custom\.svg$/,
                        use: 'raw-loader' // Procesa el archivo conflictivo como un recurso en bruto
                    },
                    {
                        include: [
                            /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                            /ckeditor5-[^/\\]+[/\\]src[/\\]icons[/\\][^/\\]+\.svg$/
                        ],
                        use: [
                            'raw-loader',
                            {
                                loader: 'svgo-loader',
                                options: {
                                    configFile: path.resolve(__dirname, 'svgo.config.js')
                                }
                            }
                        ]
                    },
                    {
                        type: 'asset/resource'
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react', { throwIfNamespace: false }]]
                    }
                }
            }
        ]
    }
};
