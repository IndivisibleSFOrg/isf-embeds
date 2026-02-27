<template>
  <div class="min-h-screen bg-gradient-to-br from-isf-gold-pale via-white to-isf-tinted">
    <CountdownActions v-if="communityActions" :actions="communityActions" :initial-layout="initialLayout" :fetched-at="fetchedAt" @refresh="loadData" />
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-isf-red"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchCountdownItems } from '~/composables/googleSheets';
import type { CountdownItem } from '~/composables/googleSheets';

const route = useRoute();
const communityActions = ref<CountdownItem[] | null>(null);
const fetchedAt = ref<Date | null>(null);

type LayoutType = 'grid' | 'wall' | 'calendar' | 'carousel' | 'list';
const validLayouts: LayoutType[] = ['grid', 'wall', 'calendar', 'carousel', 'list'];

const initialLayout = computed<LayoutType | undefined>(() => {
  const layoutParam = route.query.layout as string;
  if (layoutParam && validLayouts.includes(layoutParam as LayoutType)) {
    return layoutParam as LayoutType;
  }
  return undefined;
});

const loadData = async () => {
  communityActions.value = await fetchCountdownItems();
  fetchedAt.value = new Date();
};

onMounted(loadData);

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
