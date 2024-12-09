# nimbleUi/drag 拖拽插件


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
# 或者
yarn add @nimble-ui/drag
```

### 在vue中使用
```vue
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
import drag { movePlugin, sizePlugin, guidelinesPlugin, rotatePlugin, groupPlugin } from '@nimble-ui/drag';

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
    movePlugin(),
    sizePlugin(),
    guidelinesPlugin(),
    rotatePlugin(),
    groupPlugin()
  ],
})

</script>
```

### 在react中使用
```ts
import drag from "@nimble-ui/drag"



```
