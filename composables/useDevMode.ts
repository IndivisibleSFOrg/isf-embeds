import { ref, computed } from 'vue';

// null  → no explicit override; auto-detect from build flag / query param
// true  → explicitly enabled (even in production)
// false → explicitly disabled (even when running pnpm dev locally)
const manualOverride = ref<boolean | null>(null);

/**
 * Composable for dev mode state and toggle.
 *
 * Dev mode is active when any of the following are true (in priority order):
 *  1. The runtime toggle has set an explicit override (takes precedence over everything)
 *  2. URL query param `env=dev` forces on / `env=prd` forces off (both override `import.meta.dev`)
 *  3. `import.meta.dev` (i.e. running via `pnpm dev`)
 *
 * The toggle always sets an explicit override, so clicking it while running
 * locally will disable dev mode (overriding `import.meta.dev`).
 *
 * Returns:
 *  - `isDevMode`: ComputedRef<boolean> — reactive dev mode state
 *  - `toggle`: function — flip between explicit on/off, clearing auto-detect
 */
export const useDevMode = () => {
  const route = useRoute();

  const autoValue = computed(() => {
    if (route.query.env === 'prd') return false;
    if (route.query.env === 'dev') return true;
    return import.meta.dev;
  });

  const isDevMode = computed(
    () => manualOverride.value !== null ? manualOverride.value : autoValue.value
  );

  const toggle = () => {
    // Flip from the current effective value, making the result explicit.
    manualOverride.value = !isDevMode.value;
  };

  return { isDevMode, toggle };
};
