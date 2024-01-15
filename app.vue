<script setup lang="ts">
useSeoMeta({
  title: 'Projeto - Twitter',
  ogTitle: 'Projeto - Twitter',
  description: 'Meu projeto de um clone completo do Twitter. by Alisson Peixer',
  ogDescription: 'Meu projeto de um clone completo do Twitter. by Alisson Peixer',
  ogImage: 'https://media.discordapp.net/attachments/1191548186020548690/1191548198469238844/image.png',
  twitterCard: 'summary_large_image',
})
const nuxtApp = useNuxtApp();
const loading = ref(false);
nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>
<template>
  <Loading />
  <main class="w-screen h-screen xl:p-4 container mx-auto overflow-hidden">
    <Toast position="bottom-center"/>
    <NuxtLoadingIndicator />
    <ConfirmDialog></ConfirmDialog>
    <AppHeader />
    <NuxtPage />
  </main>
</template>


