<script setup>
definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});

import OverviewUser from "@/components/OverviewUser.vue";
import ExamCard from "@/components/ExamCard.vue";
import SearchExam from "@/components/SearchExam.vue";
import { ref } from "vue";
import { useExamStore } from "@/stores/useExamStore";
import Paginator from "primevue/paginator";
import { filter, includes, toLower } from "lodash";

const examStore = useExamStore();

const pageState = ref({});
const rowsPerPageState = ref({});
const defaultRowsPerPage = 4;
const searchQuery = ref("");

// Update the bookmark
const updateBookmark = (updatedExam) => {
  examStore.updateBookmark(updatedExam);
};

// Retrieve filtered exams for a category
const getFilteredExams = (categoryId) => {
  return filter(
    examStore.exams,
    (exam) =>
      exam.categoryId === categoryId &&
      includes(toLower(exam.title), toLower(searchQuery.value))
  );
};

// Retrieve paginated exams for a category
const getPaginatedExams = (categoryId) => {
  const filteredExams = getFilteredExams(categoryId);
  const currentPage = pageState.value[categoryId] || 0;
  const rowsPerPage = rowsPerPageState.value[categoryId] || defaultRowsPerPage;
  const start = currentPage * rowsPerPage;

  return filteredExams.slice(start, start + rowsPerPage);
};

// Handle page change for pagination
const onPageChange = (categoryId, event) => {
  pageState.value[categoryId] = event.page;
  rowsPerPageState.value[categoryId] = event.rows;
};

// Get total number of filtered exams for a category
const getTotalRecords = (categoryId) => {
  return getFilteredExams(categoryId).length;
};
</script>

<template>
  <div class="exam-list">
    <!-- Display OverviewUser component -->
    <div class="hidden lg:grid">
      <OverviewUser />
    </div>

    <!-- Search bar -->
    <div class="my-4">
      <SearchExam v-model="searchQuery" placeholder="Search exam..." />
    </div>

    <!-- Loop through each exam category -->
    <div v-for="(examCategory, index) in examStore.categories" :key="index">
      <h2 class="exam-category-title">
        {{ index + 1 }}. {{ examCategory.category }}
      </h2>

      <!-- Display exam cards with pagination -->
      <div class="exams-card-container">
        <ExamCard
          v-for="exam in getPaginatedExams(examCategory.id)"
          :key="exam.id"
          :exam="exam"
          @update-bookmark="updateBookmark"
        />
      </div>

      <!-- Pagination for each category -->
      <div class="pagination-controls">
        <Paginator
          v-if="getTotalRecords(examCategory.id) > 0"
          :rows="rowsPerPageState[examCategory.id] || defaultRowsPerPage"
          :totalRecords="getTotalRecords(examCategory.id)"
          :first="
            (pageState[examCategory.id] || 0) *
            (rowsPerPageState[examCategory.id] || defaultRowsPerPage)
          "
          @page="(e) => onPageChange(examCategory.id, e)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
