import { builtinModules, createRequire } from 'module'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import { dir } from 'console'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default {
  input: {
    'adapters/webComponents': 'src/adapters/webComponents.ts',
    'adapters/react': 'src/adapters/react.tsx',
    'adapters/vue': 'src/adapters/vue.ts',
    'adapters/html': 'src/adapters/html.ts',
    index: 'src/index.ts',
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
        '../../src/adapters/vue': 'autodialog.js/dist/adapters/vue.js',
        '../../src/adapters/react': 'autodialog.js/dist/adapters/react.js',
      }
    })
  ],
  // ✅ 完整自动 external 方案
  external: (id) => id.startsWith('react') || id.startsWith('vue') || builtinModules.includes(id) || Object.keys(pkg.peerDependencies || {}).includes(id)
}
