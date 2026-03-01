<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

      <div
        class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label="About"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-isf-tinted flex-shrink-0">
          <h2 class="font-bold text-isf-navy text-lg">About No Kings Countdown</h2>
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
        <div class="px-5 py-5 space-y-4 overflow-y-auto">
          <p class="text-isf-navy text-sm leading-relaxed">
            The <a href="https://nokings.org/" target="_blank" rel="noopener noreferrer" class="underline hover:text-isf-blue">No Kings March</a> is a nationwide mobilization to defend democratic norms and oppose authoritarian overreach. This app helps people show up for the cause every day in the weeks leading up to the march — not just on the day itself.
          </p>
          <p class="text-isf-navy text-sm leading-relaxed">
            Each day unlocks one action completable in under 15 minutes: calling a representative, sharing a message, supporting an organization, or showing up locally. <strong>Progress is tracked privately in your browser — nothing is sent to any server.</strong>
          </p>

          <div>
            <h3 class="font-semibold text-isf-navy text-sm mb-2">What kinds of actions are available?</h3>
            <ul class="space-y-1.5">
              <li class="flex gap-2 text-sm text-isf-navy leading-relaxed">
                <span class="mt-0.5 text-isf-blue flex-shrink-0">✓</span>
                <span><strong>Completable in under 15 minutes</strong> — no lengthy commitments or sign-ups required</span>
              </li>
              <li class="flex gap-2 text-sm text-isf-navy leading-relaxed">
                <span class="mt-0.5 text-isf-blue flex-shrink-0">✓</span>
                <span><strong>Concrete and specific</strong> — a clear task with a defined end state</span>
              </li>
              <li class="flex gap-2 text-sm text-isf-navy leading-relaxed">
                <span class="mt-0.5 text-isf-blue flex-shrink-0">✓</span>
                <span><strong>Broadly accessible</strong> — relevant to people across the US, requiring no special skills or prior activist experience</span>
              </li>
              <li class="flex gap-2 text-sm text-isf-navy leading-relaxed">
                <span class="mt-0.5 text-isf-blue flex-shrink-0">✓</span>
                <span><strong>Tied to the resistance</strong> — focused on democratic norms, anti-authoritarianism, or civic engagement</span>
              </li>
              <li class="flex gap-2 text-sm text-isf-navy leading-relaxed">
                <span class="mt-0.5 text-isf-blue flex-shrink-0">✓</span>
                <span><strong>Varied in type</strong> — contacting representatives, sharing on social media, showing up locally, supporting organizations</span>
              </li>
            </ul>
          </div>

          <p class="text-isf-navy text-sm leading-relaxed">
            Have an idea for an action? <a href="https://forms.gle/2Zic21S9eiaLqVPR7" target="_blank" rel="noopener noreferrer" class="underline hover:text-isf-blue">Submit a suggestion →</a>
          </p>

          <!-- ISF Logo -->
          <div class="flex justify-center pt-2">
            <a href="https://indivisiblesf.org/" target="_blank" rel="noopener noreferrer">
              <img src="/isf-logo.webp" alt="Indivisible SF" class="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 pb-5 flex justify-end flex-shrink-0">
          <button
            class="bg-isf-blue hover:bg-isf-blue-dark text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();
</script>
