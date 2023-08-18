import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
export default {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs'
      },
      {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'es/',
        format: 'esm'
      }
    ],
    plugins: [
      peerDepsExternal({ useTsconfigDeclarationDir: true }),
      commonjs(),
      typescript()
    ]
}