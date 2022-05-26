const path = require('path');
module.exports = {
  // Update webpack config to use custom loader for worker files
  webpack: (config) => {
    // Note: It's important that the "worker-loader" gets defined BEFORE the TypeScript loader!
    config.module.rules.unshift({
      test: /\index.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          
          // Use directory structure & typical names of chunks produces by "react-scripts"
          filename: "api-build/js/[name].[contenthash:8].js",
          exclude: "/node_modules/", 
          // entry: "./index.tsx",
          // output: {
          //   filename: "bundle.js"
          // },
        },
      },
      
      resolve: {
        extensions: ['.tsx', '.ts', '.js']
      },

    //   output: {
    //     filename: 'bundleApi.js',
    //     path: path.resolve(__dirname, 'buildApi')
    // },
    });
   
    return config;
  },
//    // the paths config used when your React app is builded
//    paths: (paths) => {
//     // reading the build path from the selected .env file
//     const buildPath = process.env.REACT_APP_BUILD_PATH
//     // defining "build" as a fallback path
//     paths.appBuild = path.resolve(__dirname, buildPath ? buildPath : "build"); 
  
//     return paths;
// }
  paths: function (paths, env) {
    // Changing public to static
    paths.appPublic = path.resolve(__dirname, 'src');
    paths.appHtml = path.resolve(__dirname, 'src/index.tsx');
    return paths;
  }
};
