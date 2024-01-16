<script setup lang="ts">
import Loading from '~/components/Loading.vue';
import type { Database } from '~~/types/database.types';

import { createClient } from '@supabase/supabase-js'

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();


const isLoading = ref(Loading.methods);
const isData = ref<any>();


const syncData = async () => {
    isLoading.value?.start();
    await client.from('users')
        .select('*')
        .then((ret) => (isData.value = ret.data,isLoading.value?.finish(),console.log(isData.value)))

}

watch(user,  () => {
    syncData();
}, { immediate: true })

</script>

<template>
    <div class="mt-10" v-for="({ raw_user_meta_data }, index) in isData" :key="index">
        <Card>
        <template #content>
            <NuxtImg v-if="raw_user_meta_data && raw_user_meta_data.email" :src=raw_user_meta_data.avatar_url class="rounded-full"  width="100"/>
            Alisson Peixer
        </template>
        </Card>
    </div>
</template>