import React from 'react'
import autodialog from '../../src'


function MyDialog({ onClose }: { onClose: () => void }) {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <p>React 计数：{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={onClose}>关闭</button>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>React 测试页面</h2>
      <button onClick={() => autodialog.show(MyDialog, { title: 'React 开发测试' })}>打开 Dialog</button>
    </div>
  )
}
