import { builtinModules, createRequire } from 'module'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/autodialog.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/autodialog.cjs.js', format: 'cjs', sourcemap: true }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({ inject: true, minimize: true })
  ],
  // ✅ 完整自动 external 方案
  external: (id) =>
    id.startsWith('react') ||
    id.startsWith('vue') ||
    builtinModules.includes(id) ||
    Object.keys(pkg.peerDependencies || {}).includes(id)
}
