<script setup lang="ts">
import { SidebarInset, SidebarProvider, Toaster } from "@meldui/vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import { initializeTheme, sidebarCollapsed } from "@/stores/settings";

onMounted(() => {
    initializeTheme();
});
</script>

<template>
    <SidebarProvider :default-open="!sidebarCollapsed">
        <AppSidebar />
        <SidebarInset>
            <AppHeader />
            <main class="flex-1 p-6">
                <div class="mx-auto w-full max-w-screen-2xl">
                    <RouterView />
                </div>
            </main>
        </SidebarInset>
    </SidebarProvider>
    <Toaster position="bottom-right" :duration="10000" />
</template>
