<script setup >
import clsx from 'clsx';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const confirm = useConfirm();
const client = useSupabaseClient();
const user = useSupabaseUser()

const userName = user.value.user_metadata.preferred_username || user.value.user_metadata.name;

let opcoes = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
let formatoBrasileiro = new Intl.DateTimeFormat('pt-BR', opcoes);

let count = ref(0);
const maxLength = 150;
const messages = ref([]);
const dataPosts = ref();
const inputText = ref("");
const currentLength = ref(0);
const currentLoading = ref(false);

const currentUser = ref(user.value);

const confirm1 = (index) => {
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
            currentLoading.value = true;

            const dados = {
                body: inputText.value,
                delet: false,
                private: false,
                createdUserName: userName,
                userAvatar: user.value.user_metadata.avatar_url || null
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
                    currentLoading.value = false;
                })

            inputText.value = "";
            currentLength.value = 0;
        }
        else {
            throw new Error('Validacão do post');
        }
    } catch (error) {
        currentLoading.value = false;
        toast.add({ severity: 'error', summary: 'Erro Post', detail: error.message, life: 3000 });
    }
};

const like = async (index) => {
    try {
        if (index) {

            currentLoading.value = true;

            const currentLikes = dataPosts.value.find(({ id }) => id === index).likes;
            const currentLike = currentLikes.find(({ user_id }) => user_id === user.value.id);

            if (!currentLike) {

                await client.from('likes')
                    .upsert({
                        post_id: index
                    })
                    .select()
                    .order('created_at')
                    .then(() => {
                        syncData();
                        currentLoading.value = false;
                        toast.add({ severity: 'info', summary: 'Like', detail: 'Like no post', life: 3000 });
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
                            currentLoading.value = false;
                            toast.add({ severity: 'info', summary: 'Like', detail: 'Like removido do post', life: 3000 });
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
        currentLoading.value = false;
        toast.add({ severity: 'error', summary: 'Erro Like', detail: error.message, life: 3000 });
    }
};

const handleEventCurrentLength = () => {
    currentLength.value = inputText.value.trim().length;
}

const deletPost = async (id) => {
    if (!id) return
    await client.from('posts')
        .update({ delet: true })
        .match({ id: id })
        .select()
        .then((ret) => {
            if (!ret.data) return
            syncData();
            currentLoading.value = false;
            toast.add({ severity: 'info', summary: 'Post', detail: 'Post removido!', life: 3000 });
        })
}

const hidenShowPost = async ({ id, show }) => {
    if (!id) return
    await client.from('posts')
        .update({ show: !show })
        .match({ id: id })
        .select()
        .then((ret) => {
            if (!ret.data) return
            syncData();
            currentLoading.value = false;
            toast.add({ severity: 'info', summary: 'Post', detail: `Mudado para um post ${!show ? 'publicdo' : 'privado'}!`, life: 3000 });
        })
}


const syncData = async () => {
    await client.from('posts')
        .select('*,likes(*)')
        .eq("delet", false)
        .eq("show", true)
        .order('created_at')
        .then((ret) => dataPosts.value = ret.data)
}

watch(user, async () => {
    await client.from('posts')
        .select('*,likes(*)')
        .eq("delet", false)
        .eq("show", true)
        .order('created_at')
        .then((ret) => dataPosts.value = ret.data)
}, { immediate: true })

const logout = async () => {
    await client.auth.signOut()
        .then(() => {
            navigateTo('/signin')
            toast.add({ severity: 'success', summary: 'Logout', detail: "Deslogado", life: 3000 })
        })
}
console.log(currentUser?.value?.aud)
</script>

<template >
    <section class="overflow-hidden max-h-[93%] flex flex-col">
        <div :class="clsx(`transition-all  h-full container mx-auto w-auto flex items-center justify-center `, currentLoading ? 'fixed' : 'hidden')"
            style="z-index: 44;">
            <span class="text-2xl">
                <Icon name="line-md:loading-twotone-loop" size="100"
                    class="transition-all cursor-pointer hover:text-emerald-600" />
            </span>
        </div>
        <div :class="clsx(`transition-all blur-xl bg-stone-950/[0.7] h-full w-full `, currentLoading ? 'fixed' : 'hidden')"
            style="z-index: 40;"></div>
        <div>
            <div class="relative mt-4" style="z-index: 1;">
                <button @click="post"
                    :class="clsx(`absolute bottom-0 right-0 mb-4 mr-4 bg-emerald-900 p-2 rounded-full w-10 h-10 flex items-center justify-center`, currentLength > 150 && 'opacity-50 cursor-not-allowed')"
                    :disabled="currentLength > 150">
                    <Icon name="teenyicons:send-solid" size="20"
                        :class="clsx(`transition-all cursor-pointer hover:text-emerald-600`, currentLength > 150 && 'opacity-50 cursor-not-allowed hover:none')" />
                </button>
                <Textarea name="text-post" v-model="inputText" rows="5" class="w-full pr-14 resize-none"
                    placeholder="Que esta acontecendo..." @keyup="handleEventCurrentLength"
                    @blur="handleEventCurrentLength" />
            </div>

            <div :class="clsx(`flex justify-end`, currentLength > 150 ? 'text-red-600' : 'text-white')">
                {{ currentLength }} / {{ maxLength }}
            </div>
        </div>
        <div class="overflow-y-auto flex-1 p-4 flex-col mt-10">
            <transition-group name="p-message" tag="div">
                <div class="mt-10" v-for="(item, index) in dataPosts" :key="index">
                    <Card>
                        <template #title>
                            <div class="flex gap-4 items-center">
                                <Icon v-if="!item?.userAvatar" name="teenyicons:user-circle-outline" size="40" />
                                <NuxtImg v-if="item?.userAvatar" :src=item.userAvatar width="40" height="40"
                                    class="rounded-full" />
                                <span class="text-base">@{{ item?.createdUserName }}</span>
                            </div>
                        </template>
                        <template #content>
                            <p class="m-0 text-pretty break-all">
                                {{ item?.body }}
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex justify-between">
                                <div class="flex gap-4 items-center justify-end">
                                    <div class="text-[10px]">
                                        {{ item?.currentData }}
                                    </div>
                                </div>
                                <div class="flex gap-4 items-center justify-end">
                                    <div class="flex gap-2 items-center text-sm">
                                        {{ item?.likes.length }} Likes
                                    </div>
                                    <Icon v-if="!item?.likes.find(({ user_id }) => user_id === user.id)"
                                        name="teenyicons:heart-outline" size="20"
                                        class="transition-all cursor-pointer hover:text-emerald-600"
                                        @click="like(item?.id)" />
                                    <Icon v-if="item?.likes.find(({ user_id }) => user_id === user.id)"
                                        name="teenyicons:heart-solid" size="20"
                                        class="transition-all cursor-pointer hover:text-emerald-600"
                                        @click="like(item?.id)" />
                                    <Icon name="mdi:trash-outline" size="24"
                                        class="transition-all cursor-pointer hover:text-red-600" @click="confirm1(item?.id)"
                                        v-if="item?.user_id === user.id" />
                                    <Icon name="entypo:eye" size="24"
                                        class="transition-all cursor-pointer hover:text-green-600"
                                        @click="hidenShowPost(item)" v-if="item?.show && item?.user_id === user.id" />
                                    <Icon name="entypo:eye-with-line" size="24"
                                        class="transition-all cursor-pointer hover:text-red-600"
                                        @click="hidenShowPost(item)" v-if="!item?.show && item?.user_id === user.id" />
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </transition-group>
        </div>

    </section>
</template>