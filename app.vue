<template>
  <Html lang="en">
    <Body class="antialiased">
      <NuxtPage />
      <DevModeToggle />
    </Body>
  </Html>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en'
  }
});
</script>
