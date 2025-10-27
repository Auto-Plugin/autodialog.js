<script setup lang="ts">
import autoDialog from '../../src';
import { ref } from 'vue'

// 使用新的DOM移动模式
function open() {
  autoDialog.show(null, {
    domMove: {
      containerId: 'vue-dialog-container',  // 弹窗容器的ID
      sourceElementId: 'num'                // 要移动的元素ID
    },
    showMask: true,
    animation: true,
    onOpened: () => console.log('Vue DOM移动弹窗已打开'),
    onClosed: () => console.log('Vue DOM移动弹窗已关闭，元素已恢复')
  })
}

// 响应式数据
const count = ref(0)
const message = ref('Hello AutoDialog DOM Move!')

const closeDialog = () => {
  autoDialog.close()
}
</script>

<template>
  <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
    {{ count }}
    <h2>Vue AutoDialog DOM移动模式测试</h2>
    <p style="color: #666; margin-bottom: 20px;">
      这个示例展示了新的DOM移动模式，目标元素ID为 "num"
    </p>
    
    <!-- 要移动的内容，ID为 "num" -->
    <div id="num" style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 3px dashed #007bff; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #007bff;">🎯 这是ID为 "num" 的元素</h3>
      
      <!-- Vue 响应式计数器 -->
      <div style="text-align: center; margin: 20px 0;">
        <div style="font-size: 2em; color: #007bff; font-weight: bold; margin-bottom: 15px;">
          计数器: {{ count }}
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
          <button @click="count++" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">+1</button>
          <button @click="count--" style="padding: 8px 16px; background: #ffc107; color: #333; border: none; border-radius: 6px; cursor: pointer;">-1</button>
          <button @click="count = 0" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">重置</button>
        </div>
      </div>

      <!-- Vue 双向绑定输入框 -->
      <div style="margin: 20px 0;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">输入文本:</label>
        <input 
          v-model="message" 
          placeholder="输入一些文字..." 
          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 10px;"
        />
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
          <strong>实时预览:</strong>
          <p style="margin: 5px 0; color: #007bff;">{{ message }}</p>
        </div>
      </div>

      <!-- 计算属性展示 -->
      <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>📊 实时计算:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>当前计数: <strong>{{ count }}</strong></li>
          <li>计数平方: <strong>{{ count * count }}</strong></li>
          <li>文本长度: <strong>{{ message.length }}</strong></li>
          <li>是否为偶数: <strong>{{ count % 2 === 0 ? '是' : '否' }}</strong></li>
        </ul>
      </div>

      <!-- 关闭按钮 -->
      <div style="text-align: center; margin-top: 20px;">
        <button @click="closeDialog" style="padding: 12px 24px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
          关闭弹窗
        </button>
      </div>

      <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
        🚀 这个元素ID为 "num"，会被完整移动到弹窗中，Vue响应式绑定完全保持！
      </p>
    </div>

    <!-- 控制按钮 -->
    <div style="text-align: center; margin: 30px 0;">
      <button @click="open" style="padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
        📦 移动 "num" 元素到弹窗
      </button>
    </div>

    <!-- 使用说明 -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3>💡 DOM移动模式说明</h3>
      <ul style="color: #666;">
        <li>点击按钮会将ID为 "num" 的元素移动到弹窗中</li>
        <li>Vue的响应式数据绑定在移动过程中完全保持</li>
        <li>关闭弹窗时元素会自动回到原来的位置</li>
        <li>无需适配器，纯DOM操作实现</li>
      </ul>
      
      <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <strong>🔧 代码示例:</strong>
        <pre style="margin: 10px 0; color: #333; overflow-x: auto;"><code>autoDialog.show(null, {
  domMove: {
    containerId: 'vue-dialog-container',
    sourceElementId: 'num'  // 目标元素ID
  }
})</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

button:active {
  transform: translateY(0);
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
