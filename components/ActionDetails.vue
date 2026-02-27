<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

      <!-- Modal panel -->
      <div
        class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="action.headline"
      >
        <!-- Image header -->
        <div class="relative aspect-square w-full flex-shrink-0">
          <img
            :src="action.image_back_url || action.image_front_url || defaultImage"
            :alt="action.headline"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          <!-- Date label -->
          <div class="absolute top-3 left-3 text-white font-bold text-xl leading-none drop-shadow">
            {{ dateLabel }}
          </div>

          <!-- Close button -->
          <button
            class="absolute top-3 right-3 text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Scrollable content -->
        <div class="aspect-square w-full flex-shrink-0 overflow-y-auto p-5 flex flex-col gap-4">
          <div class="flex items-start gap-2">
            <h2
              class="font-bold text-isf-navy text-lg leading-snug flex-1"
              v-html="renderInlineMarkdown(action.headline)"
            />
            <!-- Completion toggle -->
            <button
              class="flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors mt-0.5"
              :class="isComplete(action.date) ? 'bg-isf-green hover:bg-isf-green-dark' : 'bg-gray-400/80 hover:bg-gray-500'"
              :title="isComplete(action.date) ? 'Mark incomplete' : 'Mark complete'"
              @click="toggleComplete(action.date)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
            <!-- Share -->
            <button
              v-if="(canShare && isComplete(action.date)) || isDev"
              class="flex-shrink-0 transition-colors p-0.5 mt-0.5"
              :class="canShare ? 'text-isf-slate hover:text-isf-red' : 'text-isf-slate'"
              aria-label="Share"
              @click="shareAction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          <div
            v-if="action.details"
            class="markdown-content text-isf-navy text-sm leading-relaxed"
            v-html="renderMarkdown(action.details)"
          />

          <!-- CTA link -->
          <a
            v-if="action.link_url && action.link_url !== '#'"
            :href="action.link_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 bg-isf-red hover:bg-isf-red-dark text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            {{ action.link_text || 'Learn more' }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import defaultImage from '~/assets/christy-dalmat-y_z3rURYpR0-unsplash.webp';
import { renderMarkdown, renderInlineMarkdown } from '~/composables/useMarkdown';
import type { CountdownItem } from '~/composables/googleSheets';
import { useActionCompletion } from '~/composables/useActionCompletion';

interface Props {
  action: CountdownItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const { isComplete, toggleComplete } = useActionCompletion();

const dateLabel = computed(() => {
  const d = props.action.date;
  return `${d.getMonth() + 1}/${d.getDate()}`;
});

const canShare = computed(() => typeof navigator !== 'undefined' && !!navigator.share);
const { isDevMode: isDev } = useDevMode();

const shareAction = async () => {
  try {
    await navigator.share({
      title: `No Kings 3 Countdown: ${props.action.headline}`,
      text: props.action.social_message || props.action.details,
      url: window.location.href,
    });
  } catch (err) {
    // User cancelled or share failed — silently ignore
  }
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
}
.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-content :deep(strong) {
  font-weight: 700;
}
.markdown-content :deep(em) {
  font-style: italic;
}
.markdown-content :deep(a) {
  color: var(--color-isf-blue, #1b5fa3);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown-content :deep(a:hover) {
  color: var(--color-isf-blue-dark, #134880);
}
.markdown-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.markdown-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}
.markdown-content :deep(li) {
  margin-bottom: 0.25rem;
}
.markdown-content :deep(code) {
  background: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.875em;
}
</style>
