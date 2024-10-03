const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

esbuild.build({
  entryPoints: ["src/exporter.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "dist/src/exporter.js",
  platform: "node",
  target: "esnext",
  plugins: [dtsPlugin()],
}).catch(() => process.exit(1));
