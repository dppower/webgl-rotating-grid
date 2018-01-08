const fs = require("fs");
const rollup = require("rollup");
const nodeResolve = require("rollup-plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");
const include = require("rollup-plugin-includepaths");
const rxPaths = require("rxjs/_esm5/path-mapping");

function createBundle() {
    return rollup.rollup(
        {
            input: "./entry.js",
            plugins: [
                include({ include: rxPaths() }),
                nodeResolve({
                    jsnext: true,
                    module: true
                }),
                uglify()
            ],
            onwarn(warning) {
                if (warning.code === 'THIS_IS_UNDEFINED') return;
                console.warn(warning.message);
            }
        }
    );
    
}

function writeBundle(bundle) {
    return bundle.write(
        {
            format: "iife",
            file: "./docs/bundle.js",
            sourcemap: true
        }
    );
}

(async function main() {
    let bundle = await createBundle();
    await writeBundle(bundle);
})()
.catch(err => {
    console.log(err);
});

