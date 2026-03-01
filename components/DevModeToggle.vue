<template>
  <!-- Container fills lower-left corner to give a hover target even when invisible -->
  <div class="fixed bottom-0 left-0 z-50 p-3 group">
    <!-- Info panel: always visible in dev mode, appears on hover in prd -->
    <div
      :class="[
        'mb-2 text-xs font-mono rounded border px-3 py-2 leading-relaxed transition-all duration-300 select-none',
        isDevMode
          ? 'opacity-100 bg-gray-900 text-gray-200 border-gray-600 shadow-md'
          : 'opacity-0 group-hover:opacity-100 pointer-events-none bg-gray-900 text-gray-300 border-gray-700 shadow-md',
      ]"
    >
      <div class="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Build</div>
      <div>{{ buildInfo.ref }} @ {{ buildInfo.shortSha }}</div>
      <div class="text-gray-400">{{ buildInfo.date }}</div>
      <template v-if="fetchedAt">
        <div class="border-t border-gray-700 mt-1.5 pt-1.5 text-gray-400 text-[10px] uppercase tracking-wide">Data</div>
        <button
          class="text-left text-gray-300 hover:text-white transition-colors cursor-pointer"
          title="Click to refresh data"
          @click="emit('refresh')"
        >
          {{ dataFreshnessLabel }}
        </button>
      </template>
    </div>

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
import { computed } from 'vue';

interface Props {
  fetchedAt?: Date | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ refresh: [] }>();

const { isDevMode, toggle } = useDevMode();
const config = useRuntimeConfig();

const buildInfo = computed(() => {
  const sha = config.public.commitSha as string;
  const ref = config.public.commitRef as string;
  const date = config.public.buildDate as string;
  return {
    shortSha: sha,
    ref: ref,
    date: new Date(date).toISOString().split('T')[0],
  };
});

const dataFreshnessLabel = computed(() => {
  if (!props.fetchedAt) return '';
  return props.fetchedAt.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/(\d+)\/(\d+)\/(\d+),\s*/, '$3-$1-$2 ');
});
</script>
