import { builtinModules, createRequire } from 'module'
import { readdirSync } from 'fs'
import { basename, extname } from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const adapterFiles = readdirSync('src/adapters')
const adapterInputs = Object.fromEntries(
  adapterFiles.map(file => [
    `adapters/${basename(file, extname(file))}`,
    `src/adapters/${file}`
  ])
)


export default {
  input: {
    index: 'src/index.ts',
    ...adapterInputs
  },
  output: [{ dir: 'dist', format: 'esm', sourcemap: true, entryFileNames: '[name].js' }],
  plugins: [resolve(), commonjs(), typescript(), postcss({ inject: { insertAt: 'top' }, minimize: true })],
  external: (id) =>
    builtinModules.includes(id) ||
    Object.keys(pkg.peerDependencies || {}).some(dep => id.startsWith(dep))
}
