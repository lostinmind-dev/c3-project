import { bundle } from '@c3-project';

await bundle('main.js', {
    compilerOptions: {
        inlineSourceMap: true,
    },
    minify: false,
}, true);