<template>
  <!-- Container fills lower-left corner to give a hover target even when invisible -->
  <div class="fixed bottom-0 left-0 z-50 p-4 group">
    <button
      :class="[
        'px-2 py-1 text-xs font-mono rounded border transition-all duration-300 select-none',
        isDevMode
          ? 'opacity-100 bg-amber-400 text-black border-amber-500 hover:bg-amber-300 shadow-md'
          : 'opacity-0 group-hover:opacity-100 bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700',
      ]"
      :title="isDevMode ? 'Dev mode ON – click to disable' : 'Click to enable dev mode'"
      @click="toggle"
    >
      {{ isDevMode ? 'DEV' : 'PRD' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { isDevMode, toggle } = useDevMode();
</script>
