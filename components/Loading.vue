<script lang="ts">
const currentLoading = ref(false);

export default {
  methods: {
    finish() {
      currentLoading.value = false
    },
    start()  {
      currentLoading.value = true

    }
  }
};
</script>

<script setup lang="ts">
import clsx from 'clsx';
</script>




<template>
  <div :class="clsx(`transition-all w-screen h-full flex items-center justify-center `, currentLoading ? 'fixed' : 'hidden')"
       style="z-index: 44;">
    <span class="text-2xl">
      <Icon name="line-md:loading-twotone-loop" size="100"
            class="transition-all cursor-pointer hover:text-emerald-600" />
    </span>
  </div>
  <div :class="clsx(`transition-all backdrop-blur-md bg-stone-950/[0.9] h-full w-full `, currentLoading ? 'fixed' : 'hidden')"
       style="z-index: 40;">
  </div>
</template>
