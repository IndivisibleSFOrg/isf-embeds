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
    { name: 'description', content: 'A daily action calendar counting down to the No Kings March on March 28, 2026' },
    // OpenGraph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://nokingscountdown.org/' },
    { property: 'og:title', content: 'No Kings Countdown' },
    { property: 'og:description', content: 'A daily action calendar counting down to the No Kings March on March 28, 2026' },
    { property: 'og:image', content: 'https://nokingscountdown.org/og-image.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://nokingscountdown.org/' },
    { name: 'twitter:title', content: 'No Kings Countdown' },
    { name: 'twitter:description', content: 'A daily action calendar counting down to the No Kings March on March 28, 2026' },
    { name: 'twitter:image', content: 'https://nokingscountdown.org/og-image.png' }
  ]
});
</script>
