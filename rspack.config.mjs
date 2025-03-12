export default {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css/auto',
      },
    ],
  },
};
