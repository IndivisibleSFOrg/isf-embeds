<template>
  <div class="w-full">
    <ClientOnly>
      <MasonryWall :items="actions" :ssr-columns="1" :column-width="300" :gap="16">
        <template #default="{ item }">
          <ActionCard :action="item" />
        </template>
      </MasonryWall>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall';
import ActionCard from './ActionCard.vue';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

defineProps<Props>();
</script>
