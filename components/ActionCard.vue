<template>
  <div
    class="action-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
    :class="[
      { 'cursor-pointer': !isFuture || isDev },
      { 'cursor-default': isFuture && !isDev },
      isToday ? 'ring-4 ring-isf-blue ring-offset-2' : '',
    ]"
    @click="handleCardClick"
  >
    <div class="action-card-inner">
      <!-- Front -->
      <div class="action-card-face rounded-lg overflow-hidden">
        <img
          :src="action.image_front.image_url || defaultImage"
          :alt="action.headline"
          class="absolute inset-0 w-full h-full object-cover"
          referrerpolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        <!-- Date: upper left -->
        <div class="absolute top-2 left-2 text-white font-bold text-2xl leading-none drop-shadow">
          {{ dateLabel }}
        </div>

        <!-- Today badge -->
        <div
          v-if="isToday"
          class="absolute top-2 right-2 bg-isf-blue text-white text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          Today
        </div>

        <!-- Testing badge (dev mode only) -->
        <div
          v-if="isDev && action.labels.includes('testing')"
          class="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          TEST
        </div>

        <!-- Image attribution: lower left -->
        <a
          v-if="action.image_front.artist_url"
          :href="action.image_front.artist_url"
          target="_blank"
          rel="noopener noreferrer"
          class="image-attribution absolute bottom-2 left-2 bg-isf-navy/90 text-white px-1.5 py-0.5 rounded leading-none hover:bg-isf-navy transition-colors"
          @click.stop
        >{{ action.image_front.artist_name || '©' }}</a>

        <!-- Lock overlay for future cards -->
        <div
          v-if="isFuture && !isDev"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-12 h-12 text-isf-blue"
            style="filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 2px rgba(255,255,255,0.9))"
            aria-label="Locked"
          >
            <path
              fill-rule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <!-- CTA button: centered, non-future cards only -->
        <div
          v-if="!isFuture || isDev"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <button
            class="pointer-events-auto bg-isf-red hover:bg-isf-red-dark text-white font-bold text-sm px-4 py-2 rounded-lg shadow-lg transition-colors"
            :aria-label="`Take action: ${action.headline}`"
            @click.stop="openDetail(props.action)"
          >
            {{ action.link_text || 'Take Action' }} →
          </button>
        </div>

        <!-- Completion badge: lower right -->
        <button
          v-if="!isFuture"
          class="absolute bottom-2 right-2 rounded-full w-7 h-7 flex items-center justify-center shadow transition-colors"
          :class="isComplete(action.date) ? 'bg-isf-green hover:brightness-110' : isToday ? 'bg-isf-gold hover:brightness-110' : 'bg-isf-red hover:brightness-110'"
          :title="isComplete(action.date) ? 'Completed – click for details' : isToday ? 'Still time today – click for details' : 'Not completed – click for details'"
          @click.stop="openDetail(props.action)"
        >
          <template v-if="isComplete(action.date)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
          <template v-else-if="isToday">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import defaultImage from '~/assets/christy-dalmat-y_z3rURYpR0-unsplash.webp';
import type { ActionItem } from '~/composables/googleSheets';
import { useActionCompletion } from '~/composables/useActionCompletion';
import { formatDateKey } from '~/composables/dateHelpers';

interface Props {
  action: ActionItem;
}

const props = defineProps<Props>();

const openDetail = inject<(action: ActionItem) => void>('openDetail', () => {});

const { isComplete } = useActionCompletion();

const dateLabel = computed(() => {
  const d = props.action.date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const isToday = computed(() => {
  const today = new Date();
  const d = props.action.date;
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
});

const isFuture = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return props.action.date > today;
});

const { isDevMode: isDev } = useDevMode();
const { trackCardFlip } = useAnalytics();

const handleCardClick = () => {
  if (isFuture.value && !isDev.value) return;
  trackCardFlip(formatDateKey(props.action.date));
  openDetail(props.action);
};
</script>

<style scoped>
.action-card {
  aspect-ratio: 1;
  width: 100%;
}

.action-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.action-card-face {
  position: absolute;
  inset: 0;
}

.image-attribution {
  font-size: 10px;
  transform: scale(0.8);
  transform-origin: left bottom;
}
</style>
