<script setup>
definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});
const { $api } = useNuxtApp();
const { data } = await $api.get("/your-endpoint");

import ExamCard from "@/components/ExamCard.vue";
import { computed } from "vue";
import { useExamStore } from "@/stores/useExamStore";

// data store
const examStore = useExamStore();

// bookmarked exams
const bookmarkedExams = computed(() =>
  // Use reduce to gather categories with bookmarked exams
  examStore.categories.reduce((result, category) => {
    // filter exams of category and are bookmarked
    const items = examStore.exams.filter(
      (exam) => exam.categoryId === category.id && exam.bookmark
    );

    // Add category if it has bookmarked exams
    if (items.length > 0) {
      result.push({ ...category, items });
    }

    return result;
  }, [])
);

// Function to update the bookmark status of an exam
const updateBookmark = (updateExam) => {
  examStore.updateBookmark(updateExam);
};
</script>

<template>
  <div class="exam-list">
    <div v-if="bookmarkedExams.length > 0">
      <!-- Show list of bookmarked exams -->
      <div
        class="py-6"
        v-for="(examCategory, index) in bookmarkedExams"
        :key="index"
      >
        <!-- Section Title -->
        <h2 class="exam-category-title">
          {{ examCategory.category }}
        </h2>

        <!-- Render ExamCards -->
        <div class="exams-card-container">
          <ExamCard
            v-for="exam in examCategory.items"
            :key="exam.id"
            :exam="exam"
            @update-bookmark="updateBookmark"
          />
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <!-- No exams bookmarked -->
      No exams have been bookmarked.
    </div>
  </div>
</template>

<style scoped></style>
