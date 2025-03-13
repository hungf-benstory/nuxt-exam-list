<script setup>
import { onMounted } from "vue";
import naver_icon from "@/assets/icons/naver.png";
const onNaverClick = () => {
  document.getElementById("naverIdLogin_loginButton").click();
};

onMounted(() => {
  const naverLogin = new naver.LoginWithNaverId({
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
    callbackUrl: import.meta.env.VITE_NAVER_URL_CALLBACK,
    isPopup: false,
    callbackHandle: true,
    loginButton: { color: "green" },
  });
  naverLogin.init();
});
</script>

<template>
  <div class="btn-naver">
    <!-- Naver Login Button Fake-->
    <Button @click="onNaverClick">
      <img :src="naver_icon" alt="Naver Icon" class="w-6 h-6 mr-2" />
      <span>Sign in with Naver</span>
    </Button>
  </div>

  <!-- Hidden Naver Login Button -->
  <div id="naverIdLogin" class="hidden"></div>
</template>
