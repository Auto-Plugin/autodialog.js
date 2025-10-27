import { execa } from 'execa'
import prompts from 'prompts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const { framework } = await prompts({
    type: 'select',
    name: 'framework',
    message: 'Select framework to test:',
    choices: [
      { title: 'Vue', value: 'vue' },
      { title: 'React', value: 'react' },
    ],
  })

  if (!framework) return

  const cwd = path.join(__dirname, framework)
  console.log(`\n🚀 Starting dev server for ${framework}...\n`)

  // 启动 vite
  const subprocess = execa('vite', ['--config', 'vite.config.ts'], { cwd, stdio: 'inherit' })
  subprocess.on('exit', (code: any) => process.exit(code || 0))
}

main()
