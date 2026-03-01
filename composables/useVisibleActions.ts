import { computed } from 'vue';
import type { Ref } from 'vue';
import type { CountdownItem } from '~/composables/googleSheets';
import { useDevMode } from '~/composables/useDevMode';

/**
 * Filters a list of CountdownItems to exclude actions labelled "testing"
 * in production. In dev mode, testing actions are included.
 */
export const useVisibleActions = (actions: Ref<CountdownItem[] | null>) => {
  const { isDevMode: isDev } = useDevMode();

  return computed(() =>
    (actions.value ?? []).filter(a =>
      isDev.value || !a.labels.includes('testing')
    )
  );
};
