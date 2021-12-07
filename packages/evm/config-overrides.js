const path = require('path');
module.exports = {
  // Update webpack config to use custom loader for worker files
  webpack: (config) => {
    // Note: It's important that the "worker-loader" gets defined BEFORE the TypeScript loader!
    config.module.rules.unshift({
      test: /\.worker\.ts$/,
      use: {
        loader: "worker-loader",
        options: {
          // Use directory structure & typical names of chunks produces by "react-scripts"
          filename: "static/js/[name].[contenthash:8].js",
        },
      },
    });

    return config;
  },
   // the paths config used when your React app is builded
   paths: (paths) => {
    // reading the build path from the selected .env file
    const buildPath = process.env.REACT_APP_BUILD_PATH
    // defining "build" as a fallback path
    paths.appBuild = path.resolve(__dirname, buildPath ? buildPath : "build"); 
  
    return paths;
}
};
