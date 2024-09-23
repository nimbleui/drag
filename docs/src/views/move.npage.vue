
<template>
  <div ref="warpRef" class="warp">
    <div class="move"></div>
    <div class="move"></div>
    <div class="move"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { drag, movePlugin } from '@nimble-ui/drag';

defineOptions({ name: 'move' })

const warpRef = ref<HTMLElement>()

const getEl = () => warpRef.value!

drag(getEl, {
  boundary: getEl,
  agencyTarget: (el) => (el.classList.contains('move') ? el : false),
  plugins: [movePlugin()],
})

</script>

<style lang="scss" scoped>
.warp {
  height: 100vh;
  width: 100vw;
  // position: relative;

  .move {
    position: absolute;
    width: 150px;
    height: 50px;
    background-color: red;
  }
}
</style>
