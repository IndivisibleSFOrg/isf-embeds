<template>
  <Html lang="en">
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    </Head>
    <Body class="antialiased">
      <NuxtPage />
    </Body>
  </Html>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
});
</script>
