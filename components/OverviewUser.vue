<script setup>
import cbtLogo from "@/assets/images/cbt-logo.png";
import { computed } from "vue";
import dayjs from "dayjs";
import examList from "@/mock/examList.js";

// Get userInfo from cookies using useCookie
const userCookie = useCookie("userInfo");
const userInfo = computed(() => {
  return userCookie.value || null;
});

// Compute the total count of completed exams with status = 1
const completedExamsCount = computed(() => {
  return examList.reduce((count, exam) => {
    return exam.status === 1 ? count + 1 : count;
  }, 0);
});

// Compute the total count of incomplete exams with status < 1
const incompleteExamsCount = computed(() => {
  return examList.reduce((count, exam) => {
    return exam.status < 1 ? count + 1 : count;
  }, 0);
});

// Compute the number of exams that are expiring tomorrow
const daysRemaining = computed(() => {
  return examList.reduce((count, exam) => {
    const endDate = dayjs(exam.endDate);
    const today = dayjs();
    // Check if the exam ends exactly one day after today
    return endDate.isSame(today.add(1, "day"), "day") ? count + 1 : count;
  }, 0);
});
</script>

<template>
  <div class="profile-container">
    <!-- Profile Section -->
    <div class="profile-section">
      <Avatar
        :image="userInfo?.profile_image"
        class="avatar"
        size="xlarge"
        shape="circle"
      />
      <div class="profile-info">
        <span>{{ userInfo?.mobile }}</span>
        <h3>
          {{ userInfo?.name }},
          {{ new Date().getFullYear() - parseInt(userInfo?.birthyear) }}y
        </h3>
        <span class="experience-info">{{ userInfo?.email }}</span>
      </div>
    </div>

    <!-- Completed Exams Count -->
    <div class="exams-count">
      <h2>{{ completedExamsCount }}</h2>
      <p>Exams Completed</p>
    </div>

    <!-- Exams Incomplete -->
    <div class="exams-count">
      <h2>{{ incompleteExamsCount }}</h2>
      <p>Exams Incomplete</p>
    </div>

    <!-- Notification Section -->
    <div class="notification-section">
      <Image :src="cbtLogo" alt="logo CBT" class="logo" />
      <div class="notification">
        <h3>Notification</h3>
        <p>
          You have {{ daysRemaining }} upcoming exams nearing their expiration
          date!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
