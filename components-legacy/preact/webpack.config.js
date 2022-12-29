const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const production = process.env.NODE_ENV === "production";

const plugins = (production ?
    [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })
    ] :
    []).concat([
    new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: "static",
        reportFilename: "../report.html"
    })
]);

const typescriptLoader = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
        {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
                plugins: [
                    [ "@babel/transform-runtime" ]
                ]
            }
        }, {
            loader: "ts-loader"
        }
    ]
};

const jsonLoader = {
    test: /\.json$/,
    use: "json-loader"
};

const rules = [
    typescriptLoader,
    jsonLoader
];

const getExternals = (target = "cjs") => {
    const baseExternals = [
        /[Pp]react/,
        /[Pp]react\/compat/,
        {
            "tsparticles": {
                commonjs: "tsparticles",
                commonjs2: "tsparticles",
                amd: "tsparticles",
                root: "window"
            }
        },
        {
            "tsparticles-slim": {
                commonjs: "tsparticles-slim",
                commonjs2: "tsparticles-slim",
                amd: "tsparticles-slim",
                root: "window"
            }
        },
        {
            "tsparticles-engine": {
                commonjs: "tsparticles-engine",
                commonjs2: "tsparticles-engine",
                amd: "tsparticles-engine",
                root: "window"
            }
        },
    ];

    if (target === "cjs") {
        baseExternals.push(/fast-deep-equal/);
    }
    return baseExternals;
};

const getLibraryTarget = (target = "cjs") => {
    let libraryTarget;

    switch (target) {
        case "umd":
            libraryTarget = "umd";
            break;
        case "cjs":
            libraryTarget = "commonjs";
            break;
        default:
            libraryTarget = target;
    }

    return libraryTarget;
};

const getOutput = (target = "cjs") => {
    const baseOutput = {
        path: __dirname + `/${target}`,
        filename: "particles.js",
        libraryTarget: getLibraryTarget(target)
    };

    if (target === "umd") {
        baseOutput.library = "Particles";
        baseOutput.globalObject = "this";
    }

    return baseOutput;
};

const getConfig = (target = "cjs") => {
    return {
        mode: production ? "production" : "development",
        context: __dirname,
        devtool: production ? false : "source-map-loader",
        resolve: {
            extensions: [ ".ts", ".tsx", ".js" ],
            alias: {
                "react": "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat"
                // Must be below test-utils
            }
        },
        entry: "./src/index.ts",
        output: getOutput(target),
        target: "web",
        module: {
            rules
        },
        externals: getExternals(target),
        plugins
    };
};

module.exports = [ getConfig("cjs"), getConfig("umd") ];
