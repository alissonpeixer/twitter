<script setup>
import { useToast } from "primevue/usetoast";

const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();
const userProfile = ref(user?.value?.user_metadata)
const toast = useToast();

const items = ref([
    {
        label: 'Feed',
        route: '/',
        icon: "teenyicons:home-alt-outline"

    },
    {
        label: 'Users',
        route: '/user/list',
        icon:"teenyicons:user-solid"

    },
    {
        label: 'Perfil',
        route: '/user/profile',
        icon: ''

    }
]);



const logout = async () => {
    await client.auth.signOut().then(ret => {
        toast.add({ severity: 'info', summary: 'Logout', detail: 'Deslogado', life: 3000 });
        return navigateTo('/signin');
    })
}

</script>

<template>
    <Menubar :model="items" v-if="!route.path.includes('/signin')" >
        <template #item="{ item, props, hasSubmenu, root }">
            <router-link v-if="item?.route && route.path !== item?.route" v-slot="{ href, navigate }" :to="item.route"
                custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <Avatar v-if="!item.icon" :image=userProfile?.avatar_url shape="circle" class="w-[30px] h-[30px]" />
                    <Icon v-if="item.icon" :name="item.icon" size="20"/>
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <div class="flex gap-5 items-center">
                <h5 class=" text-gray-800 hidden lg:flex dark:text-white">Olá, {{ userProfile?.full_name }}</h5>
                <Button label="Sair" severity="danger" size="small" @click="logout" />
            </div>
        </template>
    </Menubar>
</template>