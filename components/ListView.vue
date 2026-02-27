<template>
  <div class="w-full space-y-8">
    <div
      v-for="week in weekGroups"
      :key="week.label"
    >
      <!-- Week heading -->
      <h2 class="text-sm font-bold uppercase tracking-widest text-isf-slate mb-3 px-1 border-b border-isf-tinted pb-2">
        {{ week.label }}
      </h2>

      <!-- Cards for this week -->
      <div class="space-y-3">
        <div
          v-for="action in week.actions"
          :key="action.date.toISOString()"
          :class="[
            'card-flip cursor-pointer rounded-lg shadow hover:shadow-md transition-all duration-300',
            { flipped: flippedCards.has(action.date.toISOString()) }
          ]"
          @click="handleCardClick(action.date.toISOString(), $event)"
        >
          <div class="card-flip-inner" style="height: 96px;">
            <!-- Front: image thumbnail + date -->
            <div class="card-front rounded-lg overflow-hidden flex flex-row h-full">
              <div class="relative w-24 flex-shrink-0">
                <img
                  :src="action.image_front_url || defaultImage"
                  :alt="action.headline"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/25"></div>
              </div>
              <div
                :class="[
                  'flex-1 flex items-center px-4 bg-white',
                  isToday(action.date) ? 'border-l-4 border-isf-blue' : 'border-l-4 border-isf-red'
                ]"
              >
                <div>
                  <div class="text-2xl font-bold text-isf-navy leading-none">
                    {{ dayName(action.date) }}
                  </div>
                  <div class="text-sm text-isf-slate mt-0.5">
                    {{ monthDay(action.date) }}
                  </div>
                  <div
                    v-if="isToday(action.date)"
                    class="mt-1 inline-block bg-isf-blue text-white text-xs px-2 py-0.5 rounded-full font-semibold"
                  >
                    Today
                  </div>
                </div>
              </div>
            </div>

            <!-- Back: headline + details + link -->
            <div
              class="card-back rounded-lg overflow-hidden flex flex-row h-full"
              @click="handleLinkClick(action.link_url, action.date.toISOString(), $event)"
            >
              <div class="relative w-24 flex-shrink-0">
                <img
                  :src="action.image_back_url || defaultImage"
                  :alt="action.headline"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/20"></div>
              </div>
              <div class="flex-1 flex flex-col justify-center px-4 bg-white border-l-4 border-isf-blue overflow-hidden">
                <p class="font-semibold text-isf-navy text-sm leading-tight line-clamp-2">
                  {{ action.headline }}
                </p>
                <div class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-isf-blue">
                  <span>Take Action</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import defaultImage from '~/assets/christy-dalmat-y_z3rURYpR0-unsplash.webp';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

const flippedCards = ref<Set<string>>(new Set());

// Return the Monday of the week containing `date`
const weekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift so Monday = 0
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const weekGroups = computed(() => {
  const sorted = [...props.actions].sort((a, b) => a.date.getTime() - b.date.getTime());

  const groups: { label: string; startMs: number; actions: CountdownItem[] }[] = [];

  for (const action of sorted) {
    const start = weekStart(action.date);
    const startMs = start.getTime();
    let group = groups.find(g => g.startMs === startMs);
    if (!group) {
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      group = { label: `${fmt(start)} – ${fmt(end)}`, startMs, actions: [] };
      groups.push(group);
    }
    group.actions.push(action);
  }

  return groups;
});

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
};

const dayName = (date: Date): string =>
  date.toLocaleDateString('en-US', { weekday: 'short' });

const monthDay = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const handleCardClick = (key: string, e: Event) => {
  e.preventDefault();
  if (flippedCards.value.has(key)) {
    flippedCards.value.delete(key);
  } else {
    flippedCards.value.add(key);
  }
  flippedCards.value = new Set(flippedCards.value);
};

const handleLinkClick = (link: string, key: string, e: Event) => {
  if (!flippedCards.value.has(key)) {
    e.preventDefault();
    flippedCards.value.add(key);
    flippedCards.value = new Set(flippedCards.value);
  } else {
    window.open(link, '_blank', 'noopener,noreferrer');
    e.preventDefault();
  }
};
</script>

<style scoped>
.card-flip {
  perspective: 1000px;
  width: 100%;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.card-flip.flipped .card-flip-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  top: 0;
  left: 0;
}

.card-back {
  transform: rotateY(180deg);
}
</style>
