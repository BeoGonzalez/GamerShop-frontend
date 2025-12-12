const path = require("path");

module.exports = function (config) {
  config.set({
    // 1. Frameworks necesarios
    frameworks: ["jasmine", "webpack"],

    // 2. Archivos que Karma debe vigilar (Tus tests)
    files: [
      // watched: false deja que Webpack maneje la vigilancia de archivos
      { pattern: "src/**/*.spec.js", watched: false },
    ],

    // 3. Preprocesadores: Mandamos todo a Webpack antes de probar
    preprocessors: {
      "src/**/*.spec.js": ["webpack"],
    },

    // 4. Configuración de Webpack para Testing
    webpack: {
      mode: "development",
      module: {
        rules: [
          // A) REGLA PARA JAVASCRIPT / REACT (BABEL)
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
          // B) REGLA PARA ESTILOS (CSS)
          // Evita que los 'import "./App.css"' rompan el test
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          // C) REGLA PARA IMÁGENES (CORRECCIÓN DEL LOGO)
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
                options: {
                  // CRÍTICO: No emitir el archivo físico en el servidor de pruebas
                  // Esto evita que Karma busque archivos que no están en su carpeta
                  emitFile: false,

                  // CRÍTICO: Importar como string directo ("path/img.png")
                  // en lugar de objeto módulo ({ default: "..." })
                  esModule: false,

                  name: "[path][name].[ext]",
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
      // Reduce el ruido en la terminal (solo muestra errores)
      stats: "errors-only",
    },

    // 5. Configuración de Reportes y Navegador
    reporters: ["progress", "kjhtml"],

    // Puerto donde corre Karma
    port: 9876,

    // Habilitar colores en la terminal
    colors: true,

    // Nivel de log
    logLevel: config.LOG_INFO,

    // Auto watch: Si cambias código, el test corre solo
    autoWatch: true,

    // Navegador real
    browsers: ["Chrome"],

    // Tiempos de espera (Aumentados para evitar desconexiones en PCs lentas)
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,

    // false = Mantener navegador abierto para debuggear
    singleRun: false,
  });
};
