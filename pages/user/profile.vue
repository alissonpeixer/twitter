<script setup lang="ts" >

import clsx from 'clsx';
import { format } from 'date-fns';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import type { Post } from '~~/types/post'
import Loading from '~/components/Loading.vue';
import type { Database } from '~~/types/database.types'

const toast = useToast();
const confirm = useConfirm();
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const userProfile = ref(user?.value?.user_metadata);
const visible = ref(false);
const editingPostId = ref("");

const isLoading = ref(Loading.methods);


const maxLength = 150;

const dataPosts = ref<Post[]>();
const inputText = ref("");
const currentLength = ref(0);
const currentLoading = ref(true);



const handleEventCurrentLength = () => {
    currentLength.value = inputText.value.trim().length;
}

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

const deletPost = async (index: string) => {
    if (!index) return
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
        .eq("user_id", user.value?.id)
        .order('created_at')
        .then((ret) => (dataPosts.value = ret.data || [], isLoading.value?.finish()))
}

const editPost = async (index: string) => {
    if(index)
    {
        const currentLikes = dataPosts.value?.find(({ id }) => id === index);

        if (currentLikes) {
            inputText.value = currentLikes?.is_body;
            editingPostId.value = currentLikes?.id;
            visible.value = true;
        }
    }
};

const saveEditPost = async (id: string) => {
    console.log(id)
    if(id)
    {
        isLoading.value?.start();
        await client.from('posts')
        .update({ is_body: inputText.value })
        .match({ id: id })
        .select()
        .then((ret) => {
            if (!ret.data) return
            syncData();
            currentLoading.value = false;
            toast.add({ severity: 'success', summary: 'Post', detail: `Post atualizado!`, life: 3000 });
            visible.value = false;
        })
    }
};


watch(user,  () => {
    syncData();
}, { immediate: true })

</script>

<template >

    <section class="overflow-hidden max-h-[93%] flex flex-col">
        <Dialog v-model:visible="visible" modal header="Editar" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <Textarea name="text-post" v-model="inputText" rows="5" class="w-full pr-14 resize-none"
                    placeholder="Que esta acontecendo..." @keyup="handleEventCurrentLength"
                    @blur="handleEventCurrentLength" />
            <Button class="mt-3 gap-3 items-center w-auto p-4" @click="saveEditPost(editingPostId)">Salvar</Button>
        </Dialog>

        <div class="w-full h-[200px] flex items-center p-4 gap-4 bg-gray-700 bg-[url('https://picsum.photos/3000/300?random=1&blur=9')] rounded-xl mt-4">
            <Avatar :image=userProfile?.avatar_url shape="circle" class="w-auto h-auto max-w-[130px]" />
            <div>
                <h4 class="text-2xl">{{ userProfile?.full_name }}</h4>
                <h5 class="text-sm text-gray-300">{{ dataPosts?.length || 0 }} Posts</h5>
            </div>
        </div>
        <div class="overflow-y-auto flex-1 p-4 flex-col mt-10">
            <div class="flex ">

            </div>
            <transition-group name="p-message" tag="div">
                <div class="mt-10" v-for="(item, index) in dataPosts" :key="index">
                    <Card :class="clsx(`transition-all border border-red-100/[0] `,  (!item?.is_public && item?.user_id === user?.id) && 'border border-red-400' )" >
                        <template #title >
                            <div class="flex justify-between">
                                <div class="flex gap-4 items-center">
                                    <Icon v-if="!item?.is_user_avatar" name="teenyicons:user-circle-outline" size="40" />
                                    <NuxtImg v-if="item?.is_user_avatar" :src=item?.is_user_avatar width="40" height="40"
                                        class="rounded-full" />
                                    <span class="text-base">@{{ item?.is_user_username }}</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <Icon name="mdi:trash-outline" size="24"
                                            class="transition-all cursor-pointer hover:text-red-600" @click="confirm1(item?.id)"
                                            v-if="item?.user_id === user?.id" />
                                    <Icon name="mdi:pen" size="24"
                                        @click="editPost(item?.id)"
                                            class="transition-all cursor-pointer hover:text-red-600"
                                            v-if="item?.user_id === user?.id" />
                                    <div
                                        class="transition-all cursor-pointer hover:text-green-600 flex gap-2 items-center"
                                        @click="hidenShowPost(item)" v-if="!item?.is_public && item?.user_id === user?.id"
                                    >
                                        <Icon name="entypo:eye" size="24"/>
                                        <!-- <span class="text-xs">Publico</span> -->
                                    </div>
                                    <div
                                        class="transition-all cursor-pointer hover:text-red-600 flex gap-2 items-center"
                                        @click="hidenShowPost(item)" v-if="item?.is_public && item?.user_id === user?.id"
                                    >
                                        <Icon name="entypo:eye-with-line" size="24"      />
                                        <!-- <span class="text-xs">Privado</span> -->
                                    </div>
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