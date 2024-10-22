
<template>
  <div ref="warpRef" class="warp">
    <div
      v-for="item in list"
      :key="item.id"
      data-drag-info="move"
      :data-drag-id="item.id"
      class="move"
      :style="{left: `${item.left}px`, top: `${item.top}px`, transform: `rotate(${item.angle || 0}deg)`}"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { drag, movePlugin, sizePlugin, guidelinesPlugin } from '@nimble-ui/drag';

defineOptions({ name: 'move' })

const list = reactive([
  {id: 1, title: '测试1', left: 0, top: 0},
  {id: 2, title: '测试2', left: 200, top: 50},
  {id: 3, title: '测试3', left: 400, top: 100},
])

const warpRef = ref<HTMLElement>()
const getEl = () => warpRef.value!

drag(getEl, {
  prevent: true,
  boundary: getEl,
  agencyTarget: (el) => {
    const dataset = (el as HTMLElement).dataset
    if (dataset.dragInfo == 'dot' || dataset.dragInfo == 'move') {
      return el
    }
    return false
  },
  changeSiteOrSize(target, data) {
    // console.log(data)
  },
  plugins: [
    movePlugin(),
    sizePlugin(),
    guidelinesPlugin()
  ],
})

</script>

<style lang="scss" scoped>
.warp {
  height: 100vh;
  width: 100vw;
  position: relative;

  .move {
    position: absolute;
    width: 150px;
    height: 50px;
    background-color: red;
  }
}
</style>
