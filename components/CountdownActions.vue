<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b-4 border-isf-blue shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="font-display text-4xl font-bold text-isf-blue">
              No Kings Countdown
            </h1>
            <p class="mt-2 text-isf-slate">
              A daily action calendar counting down to the <a href="https://nokings.org/" target="_blank"
                rel="noopener noreferrer" class="underline hover:text-isf-blue transition-colors">No Kings March</a> on
              March 28, 2026.
              Each day unlocks one civic action you can complete in under 15 minutes. Track your progress, share with
              friends, and build the movement to take back our country!
            </p>
            <p class="mt-2 text-isf-slate">
              <strong>Every action counts &mdash; start building the community that you want, today!</strong>
            </p>
            <p class="mt-1 text-isf-slate">
              <button class="underline hover:text-isf-blue transition-colors" @click="showPrivacyModal = true">Privacy
                Statement</button>
            </p>
          </div>

          <!-- Score + Share -->
          <ScoreDisplay :actions="props.actions" />


        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8 md:py-12 max-w-7xl mx-auto px-4">
      <GridView v-if="effectiveLayout === 'grid'" :actions="actions" />
      <CalendarView v-else :actions="actions" />
    </main>

    <!-- Footer -->
    <footer class="mt-16 bg-isf-blue text-white py-5">
      <div class="max-w-7xl mx-auto px-4">
        <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <button class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
            @click="showPrivacyModal = true">
            Privacy Statement
          </button>
          <a href="https://github.com/IndivisibleSFOrg/no-kings-countdown" target="_blank" rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors">
            GitHub Repo
          </a>
          <a href="https://github.com/IndivisibleSFOrg/no-kings-countdown/issues" target="_blank"
            rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors">
            Report an Issue
          </a>
          <a href="https://forms.gle/2Zic21S9eiaLqVPR7" target="_blank" rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors">
            Suggest an Action
          </a>
        </nav>
      </div>
    </footer>

    <!-- Dev mode toggle (lower-left) -->
    <DevModeToggle :fetched-at="fetchedAt" @refresh="emit('refresh')" />

    <!-- Action detail overlay -->
    <ActionDetails v-if="selectedAction" :action="selectedAction" @close="closeDetail" />

    <!-- Privacy modal -->
    <PrivacyModal v-if="showPrivacyModal" @close="showPrivacyModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue';
import type { ActionItem } from '~/composables/googleSheets';
import { formatDateKey } from '~/composables/dateHelpers';
import ActionDetails from './ActionDetails.vue';
import PrivacyModal from './PrivacyModal.vue';
import ScoreDisplay from './ScoreDisplay.vue';

interface Props {
  actions: ActionItem[];
  fetchedAt?: Date | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ refresh: [] }>();
const router = useRouter();
const route = useRoute();

const showPrivacyModal = ref(false);

// --- Detail overlay ---
const selectedAction = ref<ActionItem | null>(null);
const { isDevMode: isDev } = useDevMode();

const isActionFuture = (action: ActionItem) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return action.date > today;
};

const { trackViewDetail } = useAnalytics();

const openDetail = (action: ActionItem) => {
  if (isActionFuture(action) && !isDev.value) return;
  selectedAction.value = action;
  trackViewDetail(formatDateKey(action.date));
  router.push({ query: { ...route.query, detail: formatDateKey(action.date) } });
};

const closeDetail = () => {
  selectedAction.value = null;
  const q = { ...route.query };
  delete q.detail;
  router.push({ query: q });
};

provide('openDetail', openDetail);

// Auto-open from URL on load (actions arrive async, so watch for them)
watch(
  () => props.actions,
  (actions) => {
    const key = route.query.detail as string | undefined;
    if (key && actions.length && !selectedAction.value) {
      const match = actions.find(a => formatDateKey(a.date) === key);
      if (match && (!isActionFuture(match) || isDev.value)) {
        selectedAction.value = match;
      } else if (match && isActionFuture(match) && !isDev.value) {
        // Strip the blocked future detail param from the URL silently
        const q = { ...route.query };
        delete q.detail;
        router.replace({ query: q });
      }
    }
  },
  { immediate: true },
);

type LayoutType = 'grid' | 'calendar';

// Track window width to auto-switch calendar → grid on narrow screens
const CALENDAR_BREAKPOINT = 1200;
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280);
const onResize = () => { windowWidth.value = window.innerWidth; };
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

const effectiveLayout = computed<LayoutType>(() =>
  windowWidth.value < CALENDAR_BREAKPOINT ? 'grid' : 'calendar'
);


</script>
