<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b-4 border-isf-red shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="font-display text-4xl font-bold bg-gradient-to-r from-isf-red via-isf-blue to-isf-red bg-clip-text text-transparent">
              30 Days Until No Kings March
            </h1>
            <p class="mt-2 text-isf-slate">
              30 ways to make a difference before then
            </p>
          </div>

          <!-- Score + Share -->
          <div class="flex flex-col items-start md:items-end gap-2">
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
            <p v-if="shareNotice" class="text-xs text-isf-slate max-w-xs text-right">
              {{ shareNotice }}
            </p>
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
    <footer class="mt-16 bg-gradient-to-r from-isf-red to-isf-blue text-white py-8">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <div class="flex-1 text-center">
          <p class="text-lg font-semibold">
            Every action counts. Start making a difference today!
          </p>
          <p class="mt-2 text-sm text-white/80">
            Together, we can build stronger, more connected communities.
          </p>
          <button
            class="mt-3 text-xs text-white/60 hover:text-white underline transition-colors"
            @click="showPrivacyModal = true"
          >
            Privacy
          </button>
        </div>
        <div class="text-xs text-white/60 text-right">
          <div class="font-mono">
            {{ buildInfo.ref }} @ {{ buildInfo.shortSha }}
          </div>
          <div class="text-[10px]">
            built {{ buildInfo.date }}
          </div>
          <hr/>
          <div v-if="fetchedAt" class="text-[10px] mt-1 cursor-pointer hover:text-white/90 transition-colors" title="Click to refresh data" @click="emit('refresh')">
            data as of<br/>{{ dataFreshnessLabel }}
          </div>
        </div>
      </div>
    </footer>

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
const config = useRuntimeConfig();

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
      'Device does not support WebShare API. You must share manually. Message has been copied to the clipboard.';
    shareNoticeTimer = setTimeout(() => {
      shareNotice.value = null;
    }, 6000);
  }
};

// --- Detail overlay ---
const selectedAction = ref<CountdownItem | null>(null);
const isDev = import.meta.dev;

const isActionFuture = (action: CountdownItem) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return action.date > today;
};

const openDetail = (action: CountdownItem) => {
  if (isActionFuture(action) && !isDev) return;
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
      if (match && (!isActionFuture(match) || isDev)) {
        selectedAction.value = match;
      } else if (match && isActionFuture(match) && !isDev) {
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

const buildInfo = computed(() => {
  const sha = config.public.commitSha as string;
  const ref = config.public.commitRef as string;
  const date = config.public.buildDate as string;
  
  return {
    shortSha: sha,
    ref: ref,
    date: new Date(date).toISOString().split('T')[0]
  };
});

const dataFreshnessLabel = computed(() => {
  if (!props.fetchedAt) return '';
  return props.fetchedAt.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/(\d+)\/(\d+)\/(\d+),\s*/, '$3-$1-$2 '); // + ' PT';
});
</script>
