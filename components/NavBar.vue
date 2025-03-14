<script setup>
import { ref } from "vue";
import cbtLogo from "@/assets/images/cbt-logo.png";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import OverlayPanel from "primevue/overlaypanel";
const visible = ref(false);
const toast = useToast();
const router = useRouter();
const darkMode = ref(null);
// Define emit to send events to the parent
const emit = defineEmits(["toggleDrawer"]);
const userInfoCookie = useCookie("userInfo");
const accessTokenCookie = useCookie("access_token");
// OverlayPanel reference for user actions
const userOverlay = ref(null);

// Emit the toggleDrawer event
function toggleDrawer() {
  emit("toggleDrawer");
}

// Icon list
const icons = [
  { name: "GitHub", class: "pi pi-github" },
  { name: "Discord", class: "pi pi-discord" },
  { name: "Settings", class: "pi pi-cog" },
  { name: "User", class: "pi pi-user" },
];

// Handle icon click event
function handleIconClick(iconName, event) {
  if (iconName === "User") {
    // Show user popover when User icon is clicked
    userOverlay.value.toggle(event);
  } else if (iconName === "GitHub") {
    window.open("https://github.com/park-youngsa-dev/exam-list-hung", "_blank");
  } else {
    toast.add({
      severity: "info",
      summary: "Icon Clicked",
      detail: `You clicked on ${iconName}`,
      life: 3000,
    });
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("my-app-dark");
}

// Logout function
const handleLogout = () => {
  // Clear cookies by setting their value to null
  userInfoCookie.value = null; // This removes the 'userInfo' cookie
  accessTokenCookie.value = null; // This removes the 'access_token' cookie

  // Optionally clear localStorage if needed
  // localStorage.removeItem("notes");

  // Redirect to login page
  router.push("/login");
};
</script>

<template>
  <div class="navbar">
    <!-- Left Navbar Logo -->
    <div class="logoCbt">
      <a href="#" class="logo-img">
        <img :src="cbtLogo" alt="logo CBT" />
      </a>
    </div>

    <!-- Right Navbar List Icon-->
    <div class="icon-menu">
      <div class="toolbar-container">
        <div class="toolbar">
          <!-- Search Input with Icon -->
          <div class="search-container" @click="visible = true">
            <i class="pi pi-search"></i>
            <span>Search</span>
            <span class="shortcut">⌘ + K</span>
          </div>

          <!-- Search Icon Only for Small Screens -->
          <div class="search-icon-container" @click="visible = true">
            <i class="pi pi-search"></i>
          </div>

          <!-- Icons List -->
          <div class="toolbar-icons">
            <template v-for="(icon, index) in icons" :key="index">
              <div
                class="icon-wrapper"
                @click="handleIconClick(icon.name, $event)"
                :title="icon.name"
              >
                <i :class="icon.class" class="icon-item"></i>
              </div>
            </template>

            <!-- Icon for Light/Dark Mode -->
            <div
              class="icon-wrapper"
              @click="toggleDarkMode"
              :title="darkMode ? 'Dark Mode' : 'Light Mode'"
            >
              <i
                :class="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
                class="icon-item"
              ></i>
            </div>
          </div>

          <!-- Menu Icon for Small Screens -->
          <div class="menu-icon-container" @click="toggleDrawer">
            <i class="pi pi-bars"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popover for User Icon -->
  <OverlayPanel ref="userOverlay" class="text-xs">
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      @click="handleLogout"
      class="p-button-danger text-xs"
    />
  </OverlayPanel>

  <!-- Search Dialog -->
</template>
