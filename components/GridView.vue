<template>
  <div class="w-full">
    <div class="grid-view">
      <ActionCard
        v-for="action in sortedActions"
        :key="action.date.toISOString()"
        :action="action"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ActionCard from './ActionCard.vue';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

const sortedActions = computed(() =>
  [...props.actions].sort((a, b) => a.date.getTime() - b.date.getTime())
);
</script>

<style scoped>
.card-flip {
  perspective: 1000px;
  width: 100%;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
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

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid-view {
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .grid-view {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-view {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
</style>
