# nimble-ui drag 拖拽插件

## 📢 介绍
nimble-ui drag 拖拽插件支持以下功能：
- 拖拽
- 缩放
- 旋转
- 辅助线
- 组合拖拽
- 吸附

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
```html
<!-- 
 注意：
  1.可拖拽的元素一定要添加 data-drag-type="move" 属性，这个属性告诉插件该元素可移动
  2.data-drag-id 是唯一标识
-->
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
import { reactive, ref, onBeforeUnmount } from 'vue';
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

const { on, destroy } = drag(getEl, {
  scale: 1,
  disabled: (target, id) => id == '3',
  plugins: [
    movePlugin(), // 拖拽插件
    sizePlugin(), // 放大缩小插件
    groupPlugin(), // 组合拖拽插件
    rotatePlugin(), // 旋转插件
    guidelinesPlugin(), // 辅助线插件
  ],
})

on('change', ({list, obj}) => {
  console.log(list) // 返回数组
  console.log(obj) // 如果元素有data-drag-id属性才有值
})
on("drag", ({list, obj}) => {
  console.log(obj)
})
on("resize", ({list, obj}) => {
  console.log(obj)
})
// 销毁绑定的事件等
onBeforeUnmount(destroy)
</script>
<style lang="scss">
.warp {
  height: 100vh;
  width: 100vw;
  position: relative;
  transform: scale(1);
  transform-origin: left top;

  .move {
    position: absolute;
    width: 150px;
    height: 50px;
    background-color: red;
  }

  .content {
    position: absolute;
    left: 50px;
    top: 25px;
    width: 50%;
    height: 50%;
  }
}
</style>
```

### 在react中使用
```tsx
import drag from "@nimble-ui/drag"



```

## drag 参数
|  属性名  |    说明    |           类型           | 默认 |
|---------|------------|--------------------------|-----|
| el      |  画布元素   | element \| () => element | - |
| options |  参数       | Object                   | - |

### options属性
| 属性名            | 说明                             | 类型                  | 默认 |
|------------------| -------------------------------- | --------------------- | ---- |
| plugins          | 插件                              | Array                 |  -  |
| scale            | 画布缩放比例                      | number \| () => number |  -  |
| limitBoundary    | 限制移出画布                       | boolean                |  -  |
| changeSiteOrSize | 改变位置、大小、旋转角度触发这个方法 | (target, data) => void |  -  |
| disabled         | 禁止拖拽                          | (target, id) => boolean | -  |

## drag 返回值
| 属性名  | 说明         | 类型                     |
| ------- | ----------- | ------------------------ |
| data    | 返回改变数据 | Object                   |
| uncheck | 取消选中     | Function                 |
| on      | 绑定事件     | (type, callback) => void |
| destroy | 销毁绑定事件等| Function                |

### on支持事件
| 事件名     | 说明            | 类型                         |
| ------------ | ------------ | ---------------------------- |
| change       | 位置、大小改变 | (data: ChangeParams) => void |
| drag         | 拖拽中        | (data: ChangeParams) => void |
| drag-start   | 拖拽开始      | (data: ChangeParams) => void |
| drag-end     | 拖拽结束      | (data: ChangeParams) => void |
| resize       | 缩放中        | (data: ChangeParams) => void |
| resize-start | 缩放开始      | (data: ChangeParams) => void |
| resize-end   | 缩放结束      | (data: ChangeParams) => void |
| rotate       | 旋转中        | (data: ChangeParams) => void |
| rotate-start | 旋转开始      | (data: ChangeParams) => void |
| rotate-end   | 旋转结束      | (data: ChangeParams) => void |

#### ChangeParams类型
```ts
interface DataItem {
  el: Element;
  top: number;
  left: number;
  width: number;
  height: number;
  angle: number;
}
type ChangeParams = { list: []; obj: []; }
```