<script setup lang="ts">
  useSeoMeta({
    title: 'Projeto - Twitter',
    ogTitle: 'Projeto - Twitter',
    description: 'Meu projeto de um clone completo do Twitter. by Alisson Peixer',
    ogDescription: 'Meu projeto de um clone completo do Twitter. by Alisson Peixer',
    ogImage: 'https://media.discordapp.net/attachments/1191548186020548690/1191548198469238844/image.png',
    twitterCard: 'summary_large_image',
  })
</script>


<template>
  <main class="w-screen h-screen xl:p-4 container mx-auto overflow-hidden">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <AppHeader/>
    <NuxtPage />
  </main>
</template>