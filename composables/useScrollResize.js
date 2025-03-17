// src/composables/useScrollResize.js
import { ref, onMounted, onUnmounted } from "vue";

export function useScrollResize() {
  // State
  const hasScrolled = ref(false);
  const isSmallScreen = ref(false);

  // update screen size status
  const handleResize = () => {
    isSmallScreen.value = window.innerWidth < 1025;
  };

  // update the scrolled state
  const onScroll = () => {
    hasScrolled.value = window.scrollY > 50;
  };

  // Add scroll and resize event listeners when the component is mounted
  onMounted(() => {
    isSmallScreen.value = window.innerWidth < 1025; // Initial check
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", handleResize);
  });

  // Remove scroll and resize event listeners when the component is unmounted
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", handleResize);
  });

  // Return the reactive states for scroll and screen size
  return {
    hasScrolled,
    isSmallScreen,
  };
}
