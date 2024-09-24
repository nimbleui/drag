
<template>
  <div ref="warpRef" class="warp">
    <div data-drag-info="move" class="move"></div>
    <div data-drag-info="move" class="move"></div>
    <div data-drag-info="move" class="move"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { drag, movePlugin, sizePlugin} from '@nimble-ui/drag';

defineOptions({ name: 'move' })

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
  plugins: [movePlugin(), sizePlugin()],
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
