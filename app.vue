<template>
  <Html lang="en">
    <Body class="antialiased">
      <NuxtPage />
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
