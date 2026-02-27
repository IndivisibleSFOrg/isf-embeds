<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

      <div
        class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-isf-tinted">
          <h2 class="font-bold text-isf-navy text-lg">Privacy</h2>
          <button
            class="text-isf-slate hover:text-isf-navy bg-transparent rounded-full p-1.5 transition-colors"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-5 py-5">
          <p class="text-isf-navy text-sm leading-relaxed">
            This site does not track users or send their data anywhere. Your action progress is stored locally only and your other devices will be unaware of your progress on this device.
          </p>
        </div>

        <!-- Footer -->
        <div class="px-5 pb-5 flex justify-end">
          <button
            class="bg-isf-blue hover:bg-isf-blue-dark text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            @click="emit('close')"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{ close: [] }>();

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>
