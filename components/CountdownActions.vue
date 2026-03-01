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
              A daily action calendar counting down to the <a href="https://nokings.org/" target="_blank" rel="noopener noreferrer" class="underline hover:text-isf-blue transition-colors">No Kings March</a> on March 28, 2026.
              Each day unlocks one civic action you can complete in under 15 minutes.
              <strong>Every action counts &mdash; start building the community that you want, today!</strong>
            </p>
            <p class="mt-1 text-isf-slate">
              <button class="underline hover:text-isf-blue transition-colors" @click="showPrivacyModal = true">Privacy Statement</button>
            </p>
          </div>

          <!-- Score + Share -->
          <div class="relative flex flex-col items-start md:items-end gap-2">
            <div v-if="totalCount > 0" class="flex items-center gap-3">
              <span class="font-display text-lg font-bold text-isf-navy">
                {{ completedCount }}<span class="text-isf-slate font-normal">/{{ totalCount }}</span> completed
              </span>
              <button
                @click="handleShare"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-isf-blue text-white text-sm font-semibold hover:bg-isf-navy transition-colors"
              >
                <Share2 :size="14" />
                Share
              </button>
            </div>

            <!-- Clipboard share notice bubble -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="opacity-0 translate-y-2"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="shareNotice"
                class="absolute top-full mt-2 right-0 bg-isf-navy text-white text-xs text-center px-4 py-2.5 rounded-lg shadow-lg whitespace-nowrap z-10"
              >
                {{ shareNotice }}
              </div>
            </Transition>
          </div>


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
          <button
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
            @click="showPrivacyModal = true"
          >
            Privacy Statement
          </button>
          <a
            href="https://github.com/IndivisibleSFOrg/no-kings-countdown"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            GitHub Repo
          </a>
          <a
            href="https://github.com/IndivisibleSFOrg/no-kings-countdown/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            Report an Issue
          </a>
          <a
            href="https://forms.gle/2Zic21S9eiaLqVPR7"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            Suggest an Action
          </a>
        </nav>
      </div>
    </footer>

    <!-- Dev mode toggle (lower-left) -->
    <DevModeToggle :fetched-at="fetchedAt" @refresh="emit('refresh')" />

    <!-- Action detail overlay -->
    <ActionDetails
      v-if="selectedAction"
      :action="selectedAction"
      @close="closeDetail"
    />

    <!-- Privacy modal -->
    <PrivacyModal v-if="showPrivacyModal" @close="showPrivacyModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue';
import { Share2 } from 'lucide-vue-next';
import type { CountdownItem } from '~/composables/googleSheets';
import { formatDateKey } from '~/composables/dateHelpers';
import { useActionCompletion } from '~/composables/useActionCompletion';
import ActionDetails from './ActionDetails.vue';
import PrivacyModal from './PrivacyModal.vue';

interface Props {
  actions: CountdownItem[];
  fetchedAt?: Date | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ refresh: [] }>();
const router = useRouter();
const route = useRoute();

const showPrivacyModal = ref(false);

// --- Completion score ---
const { completedKeys } = useActionCompletion();

const shareMessage = computed(() =>
  `I'm ramping up for No Kings 3 with daily civic actions. I've completed ${completedCount.value}/${totalCount.value} actions. Join me at https://nk3-ramp-up.org/`
);

const availableActions = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return props.actions.filter(a => a.date <= today);
});

const completedCount = computed(() =>
  availableActions.value.filter(a => completedKeys.value.has(formatDateKey(a.date))).length
);

const totalCount = computed(() => availableActions.value.length);

const shareNotice = ref<string | null>(null);
let shareNoticeTimer: ReturnType<typeof setTimeout> | null = null;

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({ text: shareMessage.value });
    } catch {
      // user cancelled — ignore
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareMessage.value);
    } catch {
      // clipboard may be blocked; still show the notice
    }
    if (shareNoticeTimer) clearTimeout(shareNoticeTimer);
    shareNotice.value =
      'Message copied to clipboard! Paste it on social media or in a text to share.';
    shareNoticeTimer = setTimeout(() => {
      shareNotice.value = null;
    }, 6000);
  }
};

// --- Detail overlay ---
const selectedAction = ref<CountdownItem | null>(null);
const { isDevMode: isDev } = useDevMode();

const isActionFuture = (action: CountdownItem) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return action.date > today;
};

const openDetail = (action: CountdownItem) => {
  if (isActionFuture(action) && !isDev.value) return;
  selectedAction.value = action;
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
