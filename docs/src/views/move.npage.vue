<template>
  <div>

  </div>
  <div ref="warpRef" class="warp">
    <div
      v-for="item in list"
      :key="item.id"
      data-drag-type="move"
      :data-drag-id="item.id"
      class="move"
      :style="{
        left: `${item.left}px`,
        top: `${item.top}px`,
        transform: `rotate(${item.angle || 0}deg)`,
      }"
    >
      <div class="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue';
import {
  drag,
  movePlugin,
  sizePlugin,
  guidelinesPlugin,
  rotatePlugin,
  groupPlugin,
} from '@nimble-ui/drag';

defineOptions({ name: 'move' });

const list = reactive([
  { id: 1, title: '测试1', left: 0, top: 0, angle: 0 },
  { id: 2, title: '测试2', left: 200, top: 50 },
  { id: 3, title: '测试3', left: 500, top: 200 },
  { id: 4, title: '测试3', left: 600, top: 300 },
]);

const warpRef = ref<HTMLElement>();
const getEl = () => warpRef.value!;

const dragData = drag(getEl, {
  scale: 1,
  disabled: (target, id) => id == '3',
  equalRatio: (target, id) => id == '2' ,
  plugins: [
    movePlugin(),
    sizePlugin(),
    guidelinesPlugin(),
    rotatePlugin(),
    groupPlugin(),
  ],
});
dragData.on('change', ({obj}) => {
  console.log('change', obj)
})
dragData.on("drag", ({obj}) => {
  console.log(obj)
})
onBeforeUnmount(dragData.destroy)
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
