<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { sidebarMenu as mockMenu } from "@/mock/menu";

const props = defineProps({
  isSidebarOpen: Boolean,
});

const emit = defineEmits(["toggleDrawerSideBar"]);

const sidebarMenus = ref(mockMenu);
const activeSubItem = ref(null);

const router = useRouter();
const route = useRoute();

// Handle event when a menu is clicked
const handleMenuClick = (menu, index) => {
  // Close all other menus except the current one when a menu is clicked
  sidebarMenus.value.forEach((m, i) => {
    if (i !== index && m.subItems && m.subItems.length > 0) {
      m.expanded = false;
    }
  });

  // Toggle the expanded state of the current menu
  if (menu.subItems && menu.subItems.length > 0) {
    sidebarMenus.value[index].expanded = !sidebarMenus.value[index].expanded;
  } else {
    emit("toggleDrawerSideBar");
    if (menu.url) {
      // Navigate to the menu's URL
      router.push(menu.url);
    }
  }
};

// Handle event when a sub-item is clicked
const handleSubItemClick = (subItem) => {
  // Set the clicked subItem as active but do not collapse the menu
  activeSubItem.value = subItem;
  if (subItem.url) {
    emit("toggleDrawerSideBar");
    // Navigate to the subItem's URL
    router.push(subItem.url);
  }
};

// Function to check if the current subItem URL is active
const isSubItemActive = (subItem) => {
  // Compare the current route with the subItem's URL
  return route.path === subItem.url;
};
</script>

<template>
  <!-- Sidebar -->
  <nav>
    <ul class="sidebar-container">
      <li v-for="(menu, index) in sidebarMenus" :key="index">
        <div @click="handleMenuClick(menu, index)" class="sidebar-item">
          <div class="flex items-center">
            <div class="icon-container">
              <i :class="menu.icon" class="pi text-sm"></i>
            </div>
            <span class="menu-name">{{ menu.name }}</span>
          </div>
          <i
            v-if="menu.subItems && menu.subItems.length > 0"
            class="pi pi-chevron-down chevron-transition"
            :class="{ 'rotate-180': menu.expanded }"
          ></i>
        </div>

        <ul v-if="menu.expanded" class="submenu-list">
          <li
            v-for="(subItem, subIndex) in menu.subItems"
            :key="subIndex"
            @click.stop="handleSubItemClick(subItem)"
            :class="[
              'submenu-item',
              isSubItemActive(subItem)
                ? 'active-submenu-item border-left-active'
                : 'inactive-submenu-item',
            ]"
          >
            <NuxtLink :to="subItem.url">{{ subItem.name }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
