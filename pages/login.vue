<script setup>
definePageMeta({
  middleware: "auth",
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import LoginForm from "@/components/login/LoginForm.vue";

// const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const isLoading = ref(false);

//handle sign-in
const onSignInSubmit = async ({ valid, values }) => {
  isLoading.value = true;
  if (valid) {
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Incoming!",
      life: 3000,
    });
    isLoading.value = false;
  } else {
    isLoading.value = false;
  }
};

//handle sign-up
const onSignUpSubmit = async ({ valid, values }) => {
  isLoading.value = true;
  if (valid) {
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Incoming!",
      life: 3000,
    });
    isLoading.value = false;
  } else {
    isLoading.value = false;
  }
};
</script>

<template>
  <LoginForm
    :onSignInSubmit="onSignInSubmit"
    :onSignUpSubmit="onSignUpSubmit"
    :isLoading="isLoading"
  />
</template>
