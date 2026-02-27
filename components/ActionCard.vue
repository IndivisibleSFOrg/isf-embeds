<template>
  <div
    class="action-card cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    :class="{ flipped: isFlipped }"
    @click="flip"
  >
    <div class="action-card-inner">
      <!-- Front -->
      <div class="action-card-face action-card-front rounded-lg overflow-hidden">
        <img
          :src="action.image_front_url || defaultImage"
          :alt="action.headline"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        <!-- Date: upper left -->
        <div class="absolute top-2 left-2 text-white font-bold text-lg leading-none drop-shadow">
          {{ dateLabel }}
        </div>

        <!-- Today badge -->
        <div
          v-if="isToday"
          class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          Today
        </div>
      </div>

      <!-- Back -->
      <div class="action-card-face action-card-back rounded-lg overflow-hidden flex flex-col" @click.stop="handleBackClick">
        <!-- Upper 50%: image -->
        <div class="relative h-1/2 flex-shrink-0">
          <img
            :src="action.image_back_url || defaultImage"
            :alt="action.headline"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          <!-- Date: upper left -->
          <div class="absolute top-2 left-2 text-white font-bold text-lg leading-none drop-shadow">
            {{ dateLabel }}
          </div>
        </div>

        <!-- Lower 50%: headline + actions -->
        <div class="h-1/2 flex-shrink-0 bg-white flex flex-col justify-between px-3 py-2">
          <p class="font-bold text-gray-900 text-sm leading-snug line-clamp-4">
            {{ action.headline }}
          </p>

          <!-- Bottom row: details (left) + share + complete (right) -->
          <div class="flex items-center justify-between mt-1">
            <!-- Details link -->
            <button
              class="text-blue-600 hover:text-blue-800 text-xs font-medium underline underline-offset-2 transition-colors"
              @click.stop="openDetail(props.action)"
            >
              Details&hellip;
            </button>

            <!-- Mark complete (stub) -->
            <button
              class="rounded-full p-1 transition-colors"
              :class="isComplete ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'"
              title="Mark complete"
              @click.stop="toggleComplete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import defaultImage from '~/assets/christy-dalmat-y_z3rURYpR0-unsplash.webp';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  action: CountdownItem;
}

const props = defineProps<Props>();

const openDetail = inject<(action: CountdownItem) => void>('openDetail', () => {});

const isFlipped = ref(false);
const isComplete = ref(false);

const dateLabel = computed(() => {
  const d = props.action.date;
  return `${d.getMonth() + 1}/${d.getDate()}`;
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

const flip = () => {
  isFlipped.value = !isFlipped.value;
};

const handleBackClick = (e: Event) => {
  // Flip back when clicking the back face directly (not on a button)
  isFlipped.value = false;
};

const toggleComplete = () => {
  isComplete.value = !isComplete.value;
};
</script>

<style scoped>
.action-card {
  aspect-ratio: 1;
  width: 100%;
  perspective: 1000px;
}

.action-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.action-card.flipped .action-card-inner {
  transform: rotateY(180deg);
}

.action-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.action-card-back {
  transform: rotateY(180deg);
}
</style>
