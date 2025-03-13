<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();

// Define cookies for user info and access token
const userInfoCookie = useCookie("userInfo");
const accessTokenCookie = useCookie("access_token");

onMounted(() => {
  // Get query parameters from the URL
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Check if the user canceled the login (error=access_denied)
  if (error === "access_denied" && errorDescription.includes("Canceled")) {
    toast.add({
      severity: "warn",
      summary: "Login Canceled",
      detail: "Login process was canceled by the user.",
      life: 3000,
    });

    // Redirect the user back to the login page
    router.push("/login");
    return;
  }

  const naverLogin = new naver.LoginWithNaverId({
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
    callbackUrl: import.meta.env.VITE_NAVER_URL_CALLBACK,
    isPopup: false,
  });

  naverLogin.init();

  // Check if access token is already in URL (get hash in URL and remove #)
  const accessToken = new URLSearchParams(
    window.location.hash.substring(1)
  ).get("access_token");

  if (accessToken) {
    // Get user info from Naver login instance
    naverLogin.getLoginStatus(function (status) {
      if (status) {
        const userInfo = naverLogin.user;

        if (userInfo) {
          // Save user info and token to cookies
          userInfoCookie.value = JSON.stringify(userInfo); // Automatically manages path and expiration
          accessTokenCookie.value = accessToken;

          // Show success message
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Login successful",
            life: 3000,
          });

          // Redirect to exam list
          router.push("/exam-list");
        } else {
          console.error("Invalid login!");
        }
      }
    });
  }
});
</script>
<template></template>
