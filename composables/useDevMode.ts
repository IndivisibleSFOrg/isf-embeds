import { ref, computed } from 'vue';

// null  → no explicit override; auto-detect from build flag / query param
// true  → explicitly enabled (only relevant in local dev)
// false → explicitly disabled (only relevant in local dev)
const manualOverride = ref<boolean | null>(null);

/**
 * Composable for dev mode state and toggle.
 *
 * Dev mode is active when any of the following are true (in priority order),
 * but ONLY when running locally (`import.meta.dev`):
 *  1. The runtime toggle has set an explicit override (takes precedence over everything)
 *  2. URL query param `env=dev` forces on / `env=prd` forces off (both override `import.meta.dev`)
 *  3. `import.meta.dev` (i.e. running via `pnpm dev`)
 *
 * In production builds, dev mode is always off and the toggle is a no-op.
 *
 * Returns:
 *  - `isDevMode`: ComputedRef<boolean> — reactive dev mode state
 *  - `toggle`: function — flip between explicit on/off (local dev only)
 */
export const useDevMode = () => {
  const route = useRoute();

  const autoValue = computed(() => {
    if (!import.meta.dev) return false;
    if (route.query.env === 'prd') return false;
    if (route.query.env === 'dev') return true;
    return true;
  });

  const isDevMode = computed(
    () => manualOverride.value !== null ? manualOverride.value : autoValue.value
  );

  const toggle = () => {
    if (!import.meta.dev) return;
    // Flip from the current effective value, making the result explicit.
    manualOverride.value = !isDevMode.value;
  };

  return { isDevMode, toggle };
};
