import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

const outputDir = 'build';

export default {
    input: 'src/index.ts',
    output: {
        dir: outputDir,
        format: 'es',
        sourcemap: true,
    },
    plugins: [
        typescript(),
        copy({
            targets: [
                { src: 'static/*.html', dest: outputDir },
            ]
        }),
    ],
}