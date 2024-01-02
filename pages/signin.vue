<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">

    </h2>
    <LoginCard>
      <Button
        class="mt-3"
        label="Google"
        @click="auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })"
      />
      <Button
        class="mt-3"
        label="GitHub"
        @click="auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })"
      />
    </LoginCard>
  </div>
</template>