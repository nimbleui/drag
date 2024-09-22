
<template>
  <div ref="warpRef" class="warp">
    <div class="move"></div>
    <div class="move"></div>
    <div class="move"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { elDrag } from '@nimble-ui/move';

defineOptions({ name: 'move' })

const warpRef = ref<HTMLElement>()

const getEl = () => warpRef.value!
elDrag(getEl, {
  boundary: getEl,
  agencyTarget: (el) => (el.classList.contains('move') ? el : false),
  down({ target }) {
    const { offsetLeft: left, offsetTop: top } = target as HTMLElement
    return { left, top }
  },
  move({ disX, disY, target }, e, { down }) {
    const el = target as HTMLElement
    el.style.top = `${disY + down.top}px`;
    el.style.left = `${disX + down.left}px`;
  },
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
