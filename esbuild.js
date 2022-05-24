/* eslint-disable import/no-extraneous-dependencies */
const esbuild = require("esbuild");
const { readFile, writeFile, mkdir } = require("fs").promises;
const { minify } = require("html-minifier-terser");

const results = esbuild
    .buildSync({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        splitting: true,
        format: 'esm',
        target: ['esnext']
    });


console.log(results);
// Output:
// { errors: [], warnings: [] }

/*
(async () => {
  await mkdir("./lib");

  const script = esbuild.buildSync({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["esnext"],
    write: false,
  });

  const html = await readFile("public/index.html", "utf8");

  const minifyOptions = {
    collapseWhitespace: true,
    keepClosingSlash: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
  };

  await writeFile(
    "lib/index.html",
    `<script>${script.outputFiles[0].text}</script>${await minify(
      html,
      minifyOptions
    )}`
  );
})();
*/
