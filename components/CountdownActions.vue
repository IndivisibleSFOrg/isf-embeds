<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b-4 border-isf-blue shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div id="tour-title" class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <h1 class="font-sans text-4xl font-bold text-isf-blue">
                No Kings Countdown
              </h1>
              <!-- Hamburger menu -->
              <div class="relative flex-shrink-0" ref="menuRef">
                <button
                  class="p-2 rounded-md text-isf-slate hover:text-isf-blue hover:bg-isf-tinted transition-colors"
                  aria-label="Menu"
                  @click="showMenu = !showMenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
                <div
                  v-if="showMenu"
                  class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                >
                  <button
                    class="w-full text-left px-4 py-2 text-sm text-isf-navy hover:bg-isf-tinted transition-colors"
                    @click="showAboutModal = true; showMenu = false"
                  >
                    About
                  </button>
                  <button
                    class="w-full text-left px-4 py-2 text-sm text-isf-navy hover:bg-isf-tinted transition-colors"
                    @click="showPrivacyModal = true; showMenu = false"
                  >
                    Privacy Statement
                  </button>
                  <a
                    href="https://github.com/IndivisibleSFOrg/no-kings-countdown"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 text-sm text-isf-navy hover:bg-isf-tinted transition-colors"
                    @click="showMenu = false"
                  >
                    GitHub Repo
                  </a>
                  <a
                    href="https://github.com/IndivisibleSFOrg/no-kings-countdown/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 text-sm text-isf-navy hover:bg-isf-tinted transition-colors"
                    @click="showMenu = false"
                  >
                    Report an Issue
                  </a>
                  <a
                    href="https://forms.gle/2Zic21S9eiaLqVPR7"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 text-sm text-isf-navy hover:bg-isf-tinted transition-colors"
                    @click="showMenu = false"
                  >
                    Suggest an Action
                  </a>
                </div>
              </div>
            </div>
            <p class="mt-2 text-base font-semibold text-isf-slate">
              A daily action calendar counting down to the nationwide <a href="https://nokings.org/" target="_blank"
                rel="noopener noreferrer" class="underline hover:text-isf-blue transition-colors">No Kings March</a> on
              March 28, 2026. Complete one civic action each day — in under 15 minutes.
            </p>
          </div>

          <!-- Score + Share -->
          <ScoreDisplay id="tour-score" :actions="props.actions" />


        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main id="tour-main" class="py-8 md:py-12 max-w-7xl mx-auto px-4">
      <GridView v-if="effectiveLayout === 'grid'" :actions="actions" />
      <CalendarView v-else :actions="actions" />
    </main>

    <!-- Footer -->
    <footer class="mt-16 bg-isf-blue text-white py-5">
      <div class="max-w-7xl mx-auto px-4">
        <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <button class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
            @click="showAboutModal = true">
            About
          </button>
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

    <!-- Dev mode toggle (lower-left, local dev only) -->
    <DevModeToggle />

    <!-- Action detail overlay -->
    <ActionDetails v-if="selectedAction" :action="selectedAction" @close="closeDetail" />

    <!-- About modal -->
    <AboutModal v-if="showAboutModal" :fetched-at="fetchedAt" @close="showAboutModal = false" @refresh="emit('refresh')" />

    <!-- Privacy modal -->
    <PrivacyModal v-if="showPrivacyModal" @close="showPrivacyModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch, nextTick } from 'vue';
import type { ActionItem } from '~/composables/googleSheets';
import { formatDateKey } from '~/composables/dateHelpers';
import ActionDetails from './ActionDetails.vue';
import AboutModal from './AboutModal.vue';
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

const showAboutModal = ref(false);
const showPrivacyModal = ref(false);
const showMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);

// Close menu on outside click
const onClickOutside = (e: MouseEvent) => {
  if (!showMenu.value) return;
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showMenu.value = false;
  }
};

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
        trackViewDetail(formatDateKey(match.date));
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
onMounted(() => {
  window.addEventListener('resize', onResize);
  document.addEventListener('click', onClickOutside);
  // Start home tour for first-time visitors (deferred to let DOM settle)
  nextTick(() => setTimeout(startHomeTour, 400));
});
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  document.removeEventListener('click', onClickOutside);
});

const effectiveLayout = computed<LayoutType>(() =>
  windowWidth.value < CALENDAR_BREAKPOINT ? 'grid' : 'calendar'
);

const { startHomeTour } = useHomeTour();


</script>
