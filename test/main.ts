import { bundle } from '../mod.ts';

await bundle('main.js', {
    compilerOptions: {
        inlineSourceMap: true,
    },
    minify: false,
}, true);