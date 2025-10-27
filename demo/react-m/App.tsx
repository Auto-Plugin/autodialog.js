import React, { useState, useEffect } from 'react'
import autodialog from '../../src'

export default function App() {
  // React hooks 状态管理
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Hello AutoDialog DOM Move!')
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React Hooks', done: false },
    { id: 2, text: '测试 AutoDialog DOM移动', done: true },
    { id: 3, text: '编写技术文档', done: false }
  ])
  const [newTodoText, setNewTodoText] = useState('')

  // 使用新的DOM移动模式
  const openDialog = () => {
    autodialog.show(null, {
      domMove: {
        containerId: 'react-dialog-container',  // 弹窗容器的ID
        sourceElementId: 'react-content'        // 要移动的元素ID
      },
      showMask: true,
      animation: true,
      onOpened: () => console.log('React DOM移动弹窗已打开'),
      onClosed: () => console.log('React DOM移动弹窗已关闭，元素已恢复')
    })
  }

  const closeDialog = () => {
    autodialog.close()
  }

  // 待办事项管理
  const addTodo = () => {
    if (newTodoText.trim()) {
      const newId = Math.max(...todos.map(t => t.id)) + 1
      setTodos([...todos, { id: newId, text: newTodoText, done: false }])
      setNewTodoText('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 计算派生状态
  const completedCount = todos.filter(t => t.done).length
  const pendingCount = todos.filter(t => !t.done).length

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>React AutoDialog DOM移动模式测试</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        这是新版本的 AutoDialog，现在支持DOM移动模式！通过传入 <code>domMove</code> 参数组，
        可以直接移动指定的DOM元素到弹窗中，而不需要适配器。React 的状态管理完全保持！
      </p>
      
      {/* 要移动的内容，ID为 "react-content" */}
      <div 
        id="react-content" 
        style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '3px dashed #61dafb',
          margin: '20px 0'
        }}
      >
        <h3 style={{ marginTop: 0, color: '#61dafb' }}>
          ⚛️ 这是要移动的 React 组件内容
        </h3>
        
        {/* React 计数器 */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{ 
            fontSize: '2em', 
            color: '#61dafb', 
            fontWeight: 'bold', 
            marginBottom: '15px' 
          }}>
            React 计数器: {count}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center', 
            marginBottom: '15px' 
          }}>
            <button 
              onClick={() => setCount(c => c + 1)}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              +1
            </button>
            <button 
              onClick={() => setCount(c => c - 1)}
              style={{
                padding: '8px 16px',
                background: '#ffc107',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              -1
            </button>
            <button 
              onClick={() => setCount(0)}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              重置
            </button>
          </div>
        </div>

        {/* React 文本输入 */}
        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            实时文本输入:
          </label>
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入一些文字..." 
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '10px'
            }}
          />
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <strong>实时预览:</strong>
            <p style={{ margin: '5px 0', color: '#61dafb' }}>{message}</p>
          </div>
        </div>

        {/* React 待办事项列表 */}
        <div style={{ margin: '20px 0' }}>
          <h4>📝 React 待办事项管理</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加新任务..."
              style={{
                flex: 1,
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '6px'
              }}
            />
            <button 
              onClick={addTodo}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              添加
            </button>
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {todos.map(todo => (
              <div 
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  background: todo.done ? '#d4edda' : '#fff3cd'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span 
                  style={{
                    textDecoration: todo.done ? 'line-through' : 'none',
                    color: todo.done ? '#6c757d' : '#333',
                    flex: 1
                  }}
                >
                  {todo.text}
                </span>
                <button 
                  onClick={() => removeTodo(todo.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* React 实时计算展示 */}
        <div style={{
          background: '#e7f3ff',
          padding: '15px',
          borderRadius: '6px',
          margin: '15px 0'
        }}>
          <strong>📊 React 实时计算:</strong>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
            marginTop: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', color: '#61dafb', fontWeight: 'bold' }}>
                {count}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>当前计数</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', color: '#28a745', fontWeight: 'bold' }}>
                {count * count}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>计数平方</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', color: '#ffc107', fontWeight: 'bold' }}>
                {message.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>文本长度</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', color: '#17a2b8', fontWeight: 'bold' }}>
                {completedCount}/{todos.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>已完成任务</div>
            </div>
          </div>
        </div>

        {/* 关闭按钮 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={closeDialog}
            style={{
              padding: '12px 24px',
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            关闭弹窗
          </button>
        </div>

        <p style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          🚀 这个完整的React组件会被移动到弹窗中，所有状态和交互都保持正常！
        </p>
      </div>

      {/* 控制按钮 */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button 
          onClick={openDialog}
          style={{
            padding: '15px 30px',
            background: '#61dafb',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ⚛️ 移动 React 组件到弹窗
        </button>
      </div>

      {/* 使用说明 */}
      <div style={{
        background: 'linear-gradient(135deg, #61dafb 0%, #21759b 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '12px',
        marginTop: '40px'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 React DOM移动模式的优势</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <h4>🎯 状态保持</h4>
            <p>React hooks 状态在移动过程中完全保持</p>
          </div>
          <div>
            <h4>⚡ 性能优秀</h4>
            <p>无需重新渲染，直接DOM操作效率更高</p>
          </div>
          <div>
            <h4>🔄 事件绑定</h4>
            <p>所有事件监听器和处理函数保持有效</p>
          </div>
          <div>
            <h4>🚀 无框架依赖</h4>
            <p>不依赖React渲染机制，纯DOM移动</p>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <strong>🔧 使用方法：</strong>
          <pre style={{ margin: '10px 0', color: '#fff', overflowX: 'auto' }}>
{`autodialog.show(null, {
  domMove: {
    containerId: 'react-dialog',
    sourceElementId: 'react-content'
  }
})`}
          </pre>
        </div>
      </div>
    </div>
  )
}
