<script setup>
import { ref } from "vue";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import { useScrollResize } from "@/composables/useScrollResize";
// State Drawer
const isDrawerOpen = ref(false);

// Function on/off Drawer
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

// Close Drawer
const toggleDrawerSideBar = () => {
  isDrawerOpen.value = false;
};

const { hasScrolled, isSmallScreen } = useScrollResize();
</script>

<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <div :class="['layout-topbar', hasScrolled ? 'has-border' : '']">
      <NavBar @toggleDrawer="toggleDrawer" />
    </div>

    <!-- Sidebar -->
    <div v-if="!isSmallScreen" class="layout-content">
      <div class="layout-sidebar">
        <SideBar />
      </div>
      <div class="layout-content-slot">
        <main>
          <slot />
        </main>
      </div>
    </div>

    <!-- Drawer SideBar small screen -->
    <Drawer
      v-if="isSmallScreen"
      v-model:visible="isDrawerOpen"
      position="left"
      :modal="true"
      class="py-3"
      :dismissable="true"
    >
      <SideBar @toggleDrawerSideBar="toggleDrawerSideBar" />
    </Drawer>

    <!-- Main content small screen -->
    <div v-if="isSmallScreen" class="layout-content-slot">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
