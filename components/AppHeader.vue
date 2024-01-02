<script setup>
    const user = useSupabaseUser();
    const route = useRoute();
    const userProfile = ref(user.value.user_metadata)

    const items = ref([
        {
            label: 'Posts',
            route: '/'

        },
        {
            label: 'Perfil',
            route: '/profile'

        }
    ]);
</script>

<template>
    <Menubar :model="items" >
        <template #item="{ item, props, hasSubmenu, root }">
            <router-link v-if="item?.route && route.path !== item?.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <div class="flex align-items-center gap-5">
                <Avatar :image=userProfile.avatar_url shape="circle" class="w-[40px] h-[40px]" />
                <Button label="Sair"  severity="danger" size="small"  />
            </div>
        </template>
    </Menubar>
</template>