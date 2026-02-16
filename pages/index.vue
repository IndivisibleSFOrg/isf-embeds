<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
    <CountdownDisplay v-if="communityActions" :actions="communityActions" />
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCountdownItems } from '~/composables/googleSheets';
import type { CountdownItem } from '~/composables/googleSheets';

const communityActions = ref<CountdownItem[] | null>(null);

onMounted(async () => {
  communityActions.value = await fetchCountdownItems();
});

useHead({
  title: '30 Days Until No Kings March',
  meta: [
    {
      name: 'description',
      content: '30 ways to make a difference before No Kings March'
    }
  ]
});
</script>
