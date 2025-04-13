import { bundle } from '@lostinmind/c3-project';

await bundle('main.js', {
    compilerOptions: {
        inlineSourceMap: true,
    },
    minify: false,
}, true);