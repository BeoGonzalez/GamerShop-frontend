module.exports = function (config) {
  //llamo a set para modificar la configuración
  config.set({
    frameworks: ["jasmine"],

    //tipo de archivos para testing
    //*>src que tengan la extensión .spec.js
    files: ["src/**/*.spec.js"],

    preprocessors: {
      //pueda entender .js o .jsx
      "src/**/*.spec.js": ["webpack"],
    },

    //Configuramos WebPack
    webpack: {
      mode: "development",
      //module=reglas
      module: {
        rules: [
          //1ra regla
          {
            //aplica esto a los archivos .js o .jsx
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
          },

          //2da regla
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },

      //como resolver las importaciones
      resolve: {
        extensions: [".js", "jsx"],
      },
    },

    //definir como mostrar los resultados
    //progress = consola y kjhtml = navegador
    reporters: ["progress", "kjhtml"],

    browsers: ["Chrome"],
    //true = se a ejecutar y se cierra el navegador o el testing
    singleRun: false,
  });
};
