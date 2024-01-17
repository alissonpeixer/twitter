import { ref } from 'vue'
import { useNuxtApp } from '#app'

export default () => {
  const nuxt = useNuxtApp()
  const loading = ref(false)

  nuxt.hook('page:start', () => {
    loading.value = true
  })

  nuxt.hook('page:finish', () => {
    loading.value = false
  })

  return { loading }
}
