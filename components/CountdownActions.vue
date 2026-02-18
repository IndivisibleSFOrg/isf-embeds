<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b-4 border-red-500 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
              30 Days Until No Kings March
            </h1>
            <p class="mt-2 text-gray-600">
              30 ways to make a difference before then
            </p>
          </div>

          <!-- Layout Switcher -->
          <div class="flex gap-2 bg-gray-100 p-1 rounded-lg flex-wrap">
            <button
              @click="changeLayout('grid')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Grid3x3 :size="16" />
              <span class="hidden sm:inline">Grid</span>
            </button>
            <button
              @click="changeLayout('wall')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'wall'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <LayoutGrid :size="16" />
              <span class="hidden sm:inline">Wall</span>
            </button>
            <button
              @click="changeLayout('calendar')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Calendar :size="16" />
              <span class="hidden sm:inline">Calendar</span>
            </button>
            <button
              @click="changeLayout('carousel')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'carousel'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Image :size="16" />
              <span class="hidden sm:inline">Carousel</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8 md:py-12 max-w-7xl mx-auto px-4">
      <GridView v-if="layout === 'grid'" :actions="actions" />
      <MasonryWallView v-else-if="layout === 'wall'" :actions="actions" />
      <CalendarView v-else-if="layout === 'calendar'" :actions="actions" />
      <div v-else class="max-w-6xl mx-auto">
        <CarouselView :key="'carousel'" :actions="actions" />
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-16 bg-gradient-to-r from-red-600 to-blue-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <div class="flex-1 text-center">
          <p class="text-lg font-semibold">
            Every action counts. Start making a difference today!
          </p>
          <p class="mt-2 text-sm text-white/80">
            Together, we can build stronger, more connected communities.
          </p>
        </div>
        <div class="text-xs text-white/60 text-right">
          <div class="font-mono">
            {{ buildInfo.ref }} @ {{ buildInfo.shortSha }}
          </div>
          <div class="text-[10px]">
            built {{ buildInfo.date }}
          </div>
          <hr/>
          <div v-if="fetchedAt" class="text-[10px] mt-1 cursor-pointer hover:text-white/90 transition-colors" title="Click to refresh data" @click="emit('refresh')">
            data as of<br/>{{ dataFreshnessLabel }}
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Grid3x3, Image, LayoutGrid, Calendar } from 'lucide-vue-next';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
  initialLayout?: LayoutType;
  fetchedAt?: Date | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ refresh: [] }>();
const router = useRouter();
const config = useRuntimeConfig();

type LayoutType = 'grid' | 'wall' | 'calendar' | 'carousel';
const layout = ref<LayoutType>(props.initialLayout || 'carousel');

const changeLayout = (newLayout: LayoutType) => {
  layout.value = newLayout;
  router.push({ query: { layout: newLayout } });
};

const buildInfo = computed(() => {
  const sha = config.public.commitSha as string;
  const ref = config.public.commitRef as string;
  const date = config.public.buildDate as string;
  
  return {
    shortSha: sha.substring(0, 7),
    ref: ref,
    date: new Date(date).toISOString().split('T')[0]
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
  }).replace(/(\d+)\/(\d+)\/(\d+),\s*/, '$3-$1-$2 '); // + ' PT';
});
</script>
