<template>
  <div class="min-h-screen bg-isf-tinted">
    <CountdownActions v-if="communityActions" :actions="visibleActions" :fetched-at="fetchedAt" @refresh="loadData" />
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-isf-red"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCountdownItems } from '~/composables/googleSheets';
import type { ActionItem } from '~/composables/googleSheets';
import { useVisibleActions } from '~/composables/useVisibleActions';

const communityActions = ref<ActionItem[] | null>(null);
const visibleActions = useVisibleActions(communityActions);
const fetchedAt = ref<Date | null>(null);

const loadData = async () => {
  communityActions.value = await fetchCountdownItems();
  fetchedAt.value = new Date();
};

onMounted(loadData);

useHead({
  title: 'No Kings Countdown',
  meta: [
    {
      name: 'description',
      content: '28 ways to make a difference before No Kings March'
    }
  ]
});
</script>
