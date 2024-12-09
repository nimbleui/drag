# nimbleui drag 拖拽插件

## 介绍
nimbleUi/drag 拖拽插件支持一下功能：
- 拖拽
- 缩放
- 旋转
- 辅助线
- 组合拖拽

## ⚡ 使用说明

### 安装依赖

```sh
npm i @nimble-ui/drag
# or
yarn add @nimble-ui/drag
# or
pnpm i @nimble-ui/drag
```

### 在vue中使用
```vue
<!-- 注意：可拖拽的元素一定要添加 data-drag-type="move" 属性，这个属性告诉插件该元素可移动 -->
<template>
  <div ref="warpRef" class="warp">
    <div
      v-for="item in list"
      :key="item.id"
      data-drag-type="move"
      :data-drag-id="item.id"
      class="move"
      :style="{left: `${item.left}px`, top: `${item.top}px`, transform: `rotate(${item.angle || 0}deg)`}"
    >
      <div class="content">{{item.title}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import drag, { movePlugin, sizePlugin, guidelinesPlugin, rotatePlugin, groupPlugin } from '@nimble-ui/drag';

defineOptions({ name: 'move' })

const list = reactive([
  {id: 1, title: '测试1', left: 0, top: 0},
  {id: 2, title: '测试2', left: 200, top: 50},
  {id: 3, title: '测试3', left: 500, top: 200},
  {id: 3, title: '测试3', left: 600, top: 300},
])

const warpRef = ref<HTMLElement>()
const getEl = () => warpRef.value!

drag(getEl, {
  scale: 1,
  changeSiteOrSize(target, data) {
    console.log(data)
  },
  plugins: [
    movePlugin(), // 拖拽插件
    sizePlugin(), // 放大缩小插件
    groupPlugin(), // 组合拖拽插件
    rotatePlugin(), // 旋转插件
    guidelinesPlugin(), // 辅助线插件
  ],
})

</script>
```

### 在react中使用
```tsx
import drag from "@nimble-ui/drag"



```

## drag 参数
|  属性名  |    说明    |         类型        | 默认 |
|---------|------------|---------------------|-----|
| el      |  画布元素   | Function \| element | - |
| options |  参数       | Object              | - |

### options属性
| 属性名            | 说明                             | 类型                  | 默认 |
| -----------------| -------------------------------- | --------------------- | ---- |
| plugins          | 插件                              | Array                 | -   |
| scale            | 画布缩放比例                      | () => number \| number | -   |
| limitBoundary    | 限制移出画布(未实现)               | boolean                | -   |
| changeSiteOrSize | 改变位置、大小、旋转角度触发这个方法 | (target, data) => void | -   |