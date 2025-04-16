import { bundle } from '../mod.ts';

await bundle({
    watch: true,
    
    root: 'main.ts',
    opts: {
        compilerOptions: {
            inlineSourceMap: true,
        },
    },
    esbuild: {
        minify: true,
        treeShaking: true,
        logLevel: 'info',
        sourcemap: 'inline',
    }
})