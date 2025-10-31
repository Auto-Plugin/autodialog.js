import { builtinModules, createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { basename, extname } from 'node:path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const adapterFiles = readdirSync('src/adapters')
const adapterInputs = Object.fromEntries(
  adapterFiles.map(file => [
    `adapters/${basename(file, extname(file))}`,
    `src/adapters/${file}`
  ])
)

const adapterReplacements = Object.fromEntries(
  adapterFiles.map(file => {
    const adapterName = basename(file, extname(file))
    return [`../../src/adapters/${adapterName}`, `autodialog.js/dist/adapters/${adapterName}.js`]
  })
)


export default {
  input: {
    index: 'src/index.ts',
    ...adapterInputs
  },

  output: [{ dir: 'dist', format: 'esm', sourcemap: true, entryFileNames: '[name].js' }],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({ inject: { insertAt: 'top' }, minimize: true }),
    replace({
      preventAssignment: true,
      values: {
        __DEV__: 'false', // 打包时强制替换为 false
        ...adapterReplacements
      }
    })
  ],
  external: (id) =>
    builtinModules.includes(id) ||
    Object.keys(pkg.peerDependencies || {}).some(dep => id.startsWith(dep))
}
