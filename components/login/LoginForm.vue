<script setup>
import { ref, watch, reactive } from "vue";
import { z } from "zod";
import LoginNaver from "./LoginNaver.vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import cbtLogo from "@/assets/images/cbt-logo.png";
import bg_right from "@/assets/images/bg_right.jpg";
import { useToast } from "primevue/usetoast";
const toast = useToast();

// Define props
const props = defineProps({
  onSignInSubmit: Function,
  onSignUpSubmit: Function,
  isLoading: Boolean,
});
// State to toggle between sign-in and sign-up mode
const isSignUp = ref(false);
const formRef = ref(null);

// Initial form values for user login/signup
const initialValues = reactive({
  user_id: "",
  email: "",
  password: "",
  repassword: "",
});

// Validation schema for sign-in form using Zod
const signInSchema = z.object({
  user_id: z.string().min(1, { message: "User ID is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
});

// Validation schema for sign-up form using Zod
const signUpSchema = z
  .object({
    user_id: z.string().min(1, { message: "User ID is required!" }),
    email: z.string().min(1, { message: "Email is required!" }),
    password: z.string().min(1, { message: "Password is required!" }),
    repassword: z.string().min(1, { message: "Repassword is required!" }),
  })
  .superRefine((values, ctx) => {
    // Ensure passwords match in the sign-up form
    if (values.password !== values.repassword) {
      ctx.addIssue({
        path: ["repassword"],
        message: "Passwords do not match!",
      });
    }
  });

// Resolver to apply validation schema to the form
const resolver = ref(zodResolver(signInSchema));

// Watch for changes in the sign-up mode and update the validation schema
watch(isSignUp, (newValue) => {
  resolver.value = newValue
    ? zodResolver(signUpSchema)
    : zodResolver(signInSchema);
  // Reset form when switching modes
  formRef.value?.reset();
});

// Info message when forgot password is clicked
const showInfo = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Incoming!",
    life: 3000,
  });
};

// Toggle between sign-in and sign-up mode
const toggleMode = () => {
  isSignUp.value = !isSignUp.value;
};
</script>

<template>
  <div class="form-login-container">
    <div class="form_login">
      <div class="w-full">
        <!-- Logo CBT -->
        <img :src="cbtLogo" class="cbt-logo" />

        <!-- Naver login button -->
        <LoginNaver />

        <!-- OR separator -->
        <div class="flex items-center gap-2 my-3">
          <div class="flex-grow h-px bg-gray-300"></div>
          <span class="text-xs">Or continue with</span>
          <div class="flex-grow h-px bg-gray-300"></div>
        </div>

        <!-- Form title: dynamic based on whether it's sign-up or sign-in -->
        <h1 class="form-title">{{ isSignUp ? "Sign Up" : "Sign In" }}</h1>

        <!-- Login Form  -->
        <Form
          :initialValues="initialValues"
          :resolver="resolver"
          ref="formRef"
          @submit="isSignUp ? onSignUpSubmit($event) : onSignInSubmit($event)"
          class="form-content"
        >
          <!-- Input field for User ID -->
          <FormField v-slot="$field" name="user_id" initialValue="">
            <FloatLabel variant="on">
              <IconField>
                <InputText
                  name="user_id"
                  type="text"
                  v-model="$field.value"
                  fluid
                  class="input"
                />
                <InputIcon class="input-icon" />
              </IconField>
              <label class="label" for="user_id">User ID</label>
            </FloatLabel>
            <div class="message">
              <Message v-show="$field?.invalid" severity="error" size="small">
                {{ $field.error?.message }}
              </Message>
            </div>
          </FormField>

          <!-- Email input field (only shows when in sign-up mode) -->
          <div v-if="isSignUp">
            <FormField v-slot="$field" name="email" initialValue="">
              <FloatLabel variant="on">
                <IconField>
                  <InputText
                    name="email"
                    type="text"
                    fluid
                    v-model="$field.value"
                    class="input"
                  />
                  <InputIcon class="input-icon" />
                </IconField>
                <label class="label" for="email">Email</label>
              </FloatLabel>
              <div class="message">
                <Message v-show="$field?.invalid" severity="error" size="small">
                  {{ $field.error?.message }}
                </Message>
              </div>
            </FormField>
          </div>

          <!-- Password input field -->
          <div>
            <FormField v-slot="$field" name="password" initialValue="">
              <FloatLabel variant="on">
                <Password
                  type="text"
                  v-model="$field.value"
                  :feedback="false"
                  toggleMask
                  fluid
                  class="password"
                />
                <label class="label" for="password">Password</label>
              </FloatLabel>
              <div class="message">
                <Message v-show="$field?.invalid" severity="error" size="small">
                  {{ $field.error?.message }}
                </Message>
              </div>
            </FormField>
          </div>

          <!-- Forgot password link and switch between sign-in/sign-up modes -->
          <div class="forgot-content">
            <span @click="toggleMode" class="forgot-password">
              {{
                isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"
              }}
            </span>
            <a v-if="!isSignUp" class="forgot-password" @click="showInfo()"
              >Forgot password?</a
            >
          </div>

          <!-- Submit button (Sign In/Sign Up) -->
          <div>
            <Button
              :loading="isLoading"
              :label="isSignUp ? 'Sign Up' : 'Sign In'"
              type="submit"
              class="submit-button"
            />
          </div>
        </Form>
      </div>
    </div>

    <!-- Right-side image -->
    <div class="flex-1">
      <img :src="bg_right" alt="hero-1" class="login-image" />
    </div>
  </div>
</template>

<style></style>
