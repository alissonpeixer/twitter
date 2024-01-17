<script setup lang="ts" >
import clsx from 'clsx';
import { useConfirm } from "primevue/useconfirm";
import { format } from 'date-fns';
import { useToast } from "primevue/usetoast";

import Loading from '~/components/Loading.vue';

import type { Post } from '~~/types/post'
import type { Database } from '~~/types/database.types'



const toast = useToast();
const confirm = useConfirm();
const client = useSupabaseClient<Database>();
const user = useSupabaseUser()

const userName = user?.value?.user_metadata.preferred_username || user?.value?.user_metadata.name;


const maxLength = 150;

const dataPosts = ref<Post[]>();
const inputText = ref("");
const currentLength = ref(0);


const isLoading = ref(Loading.methods);




const confirm1 = (index: string) => {
    confirm.require({
        message: 'Realmente deseja remover o post?',
        header: 'Remover',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deletPost(index);
        }
    });
};

const post = async () => {
    try {
        if (inputText.value && inputText.value.length <= 150) {

            isLoading.value?.start();

            const dados = {
                is_body: inputText.value,
                is_public: true,
                is_user_username: userName,
                is_user_avatar: user?.value?.user_metadata.avatar_url || null
            }

            await client.from('posts')
                .upsert({
                    ...dados
                })
                .select()
                .order('created_at')
                .then(() => {
                    syncData();
                    toast.add({ severity: 'success', summary: 'Post', detail: 'Postado', life: 3000 });
                })

            inputText.value = "";
            currentLength.value = 0;
        }
        else {
            throw new Error('Validacão do post');
        }
    } catch (error) {
        if(error instanceof Error)
        {
            isLoading.value?.finish();
            toast.add({ severity: 'error', summary: 'Erro Post', detail: error.message, life: 3000 });
        }
    }
};

const like = async (index: string) => {
    try {
        if (index) {



            const currentLikes = dataPosts.value?.find(({ id }) => id === index)?.likes;
            const currentLike = currentLikes?.find(({ is_id_user }) => is_id_user === user?.value?.id);

            if (!currentLike) {

                await client.from('likes')
                    .upsert({
                        is_id_post: index
                    })
                    .select()
                    .order('created_at')
                    .then(() => {
                        syncData();

                        toast.add({ severity: 'success', summary: 'Like', detail: 'Like no post', life: 3000 });
                    })
            }
            else {
                if (currentLike) {

                    await client.from('likes')
                        .delete()
                        .match({ id: currentLike.id })
                        .select()
                        .then((ret) => {
                            if (!ret.data) return
                            syncData();

                            toast.add({ severity: 'warn', summary: 'Like', detail: 'Like removido do post', life: 3000 });
                        })
                }
                else {
                    throw new Error('Usuario não encontrado! currentLike');
                }
            }
        }
        else {
            throw new Error(' Id do post nao informado!');
        }

    } catch (error) {
        if(error instanceof Error)
        {
            isLoading.value?.finish();
            toast.add({ severity: 'error', summary: 'Erro Like', detail: error.message, life: 3000 });
        }
    }
};

const handleEventCurrentLength = () => {
    currentLength.value = inputText.value.trim().length;
}

const deletPost = async (index: string) => {
    if (!index) return
    isLoading.value?.start();
    await client.from('posts')
        .update({ is_delet: true })
        .match({ id: index })
        .select()
        .then((ret) => {
            if (!ret.data) return
            syncData();
            toast.add({ severity: 'warn', summary: 'Post', detail: 'Post removido!', life: 3000 });
        })
}

const hidenShowPost = async ({ id, is_public }:Post) => {
    if (!id) return

    await client.from('posts')
        .update({ is_public: !is_public })
        .match({ id: id })
        .select()
        .then((ret) => {
            if (!ret.data) return
            syncData();
            toast.add({ severity: 'info', summary: 'Post', detail: `Mudado para um post ${!is_public ? 'publicdo' : 'privado'}!`, life: 3000 });
        })
}


const syncData = async () => {
    await client.from('posts')
        .select('*,likes(*)')
        .eq("is_delet", false)
        .eq("is_public", true)
        .order('created_at')
        .then((ret) => (dataPosts.value = ret.data || [], isLoading.value?.finish(), console.log(dataPosts)))
}

watch(user,  () => {
    syncData();
}, { immediate: true })



</script>

<template >
    <section class="overflow-hidden max-h-[93%] flex flex-col">

        <div>
            <div class="relative mt-4" style="z-index: 1;">
                <button @click="post"
                    :class="clsx(`absolute bottom-0 right-0 mb-4 mr-4 bg-emerald-900 p-2 rounded-full w-10 h-10 flex items-center justify-center`, currentLength > 150 && 'opacity-50 cursor-not-allowed')"
                    :disabled="currentLength > 150">
                    <Icon name="teenyicons:send-solid" size="20"
                        :class="clsx(`transition-all cursor-pointer hover:text-emerald-600`, currentLength > 150 && 'opacity-50 cursor-not-allowed hover:none')" />
                        <NuxtEmoji  />
                </button>
                <Textarea name="text-post" v-model="inputText" rows="5" class="w-full pr-14 resize-none"
                    placeholder="Que esta acontecendo..." @keyup="handleEventCurrentLength"
                    @blur="handleEventCurrentLength" />
            </div>

            <div :class="clsx(`flex justify-end`, currentLength > 150 ? 'text-red-600' : 'text-white')">
                {{ currentLength }} / {{ maxLength }}
            </div>
        </div>
        <div class="overflow-y-auto flex-1 p-4 flex-col ">
            <transition-group name="p-message" tag="div">
                <div class="mt-10" v-for="(item, index) in dataPosts" :key="index">
                    <Card>
                        <template #title>
                            <div class="flex justify-between">
                                <div class="flex gap-4 items-center">
                                    <Icon v-if="!item?.is_user_avatar" name="teenyicons:user-circle-outline" size="40" />
                                    <NuxtImg v-if="item?.is_user_avatar" :src=item?.is_user_avatar width="40" height="40"
                                        class="rounded-full" />
                                    <span class="text-base">@{{ item?.is_user_username }}</span>
                                </div>
                                <div class="flex gap-4 items-center">
                                    <Icon name="entypo:eye-with-line" size="24"
                                        class="transition-all cursor-pointer hover:text-red-600"
                                        @click="hidenShowPost(item)" v-if="item?.is_public && item?.user_id === user?.id"/>

                                    <Icon name="mdi:trash-outline" size="24"
                                        class="transition-all cursor-pointer hover:text-red-600"
                                        @click="confirm1(item?.id)"  v-if="item?.user_id === user?.id"/>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <p class="m-0 text-pretty break-all">
                                {{ item?.is_body }}
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex justify-between">
                                <div class="flex gap-4 items-center justify-end">
                                    <div class="text-[9px] text-gray-500">
                                        Publicado
                                        {{  format(item?.created_at || '', ' dd MM yyyy') }}
                                        ás
                                        {{  format(item?.created_at || '', '  HH:mm:ss') }}
                                    </div>
                                </div>
                                <div class="flex gap-4 items-center justify-end">
                                    <div class="flex gap-2 items-center text-sm">
                                        {{ item?.likes.length }} Likes
                                    </div>
                                    <Icon v-if="!item?.likes.find(({ is_id_user }) => is_id_user === user?.id)"
                                        name="teenyicons:heart-outline" size="20"
                                        class="transition-all cursor-pointer hover:text-emerald-600"
                                        @click="like(item?.id)" />
                                    <Icon v-if="item?.likes.find(({ is_id_user }) => is_id_user === user?.id)"
                                        name="teenyicons:heart-solid" size="20"
                                        class="transition-all cursor-pointer hover:text-emerald-600"
                                        @click="like(item?.id)" />
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </transition-group>
        </div>

    </section>
</template>