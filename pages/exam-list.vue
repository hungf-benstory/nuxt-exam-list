<script setup>
definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});

import OverviewUser from "@/components/OverviewUser.vue";
import ExamCard from "@/components/ExamCard.vue";
import SearchExam from "@/components/SearchExam.vue";
import { ref, computed, onMounted } from "vue";
import Paginator from "primevue/paginator";
import { filter, includes, toLower } from "lodash";
const toast = useToast();
const pageState = ref({});
const rowsPerPageState = ref({});
const defaultRowsPerPage = 4;
const searchQuery = ref("");

const exams = ref([]);
const categories = ref([]);
const pending = ref(false);
const error = ref(null);

const fetchExamsAndCategories = async () => {
  pending.value = true;
  try {
    const { data: examsData } = await $fetch("/api/exams", {
      method: "GET",
      key: new Date().getTime(),
    });

    exams.value = examsData || [];

    // api categories
    const { data: categoriesData } = await $fetch("/api/categories", {
      method: "GET",
      key: new Date().getTime(),
    });

    categories.value = categoriesData || [];
  } catch (err) {
    error.value = err.message || "Error fetching data";
  } finally {
    setTimeout(() => {
      pending.value = false;
    }, 600);
  }
};

onMounted(() => {
  fetchExamsAndCategories();
});

// Filter exams by category
const getFilteredExams = (categoryId) => {
  return filter(
    exams.value,
    (exam) =>
      exam.categoryId === categoryId &&
      includes(toLower(exam.title), toLower(searchQuery.value))
  );
};

// get list exams  with pagination
const getPaginatedExams = (categoryId) => {
  const filteredExams = getFilteredExams(categoryId);

  const currentPage = pageState.value[categoryId] || 0;
  const rowsPerPage = rowsPerPageState.value[categoryId] || defaultRowsPerPage;
  const start = currentPage * rowsPerPage;

  return filteredExams.slice(start, start + rowsPerPage);
};

const onPageChange = (categoryId, event) => {
  pageState.value[categoryId] = event.page;
  rowsPerPageState.value[categoryId] = event.rows;
};

// total exams
const getTotalRecords = (categoryId) => {
  return getFilteredExams(categoryId).length;
};

const updateBookmark = async (exam) => {
  try {
    const response = await $fetch(`/api/exams`, {
      method: "PATCH",
      body: { id: exam.id, bookmark: !exam.bookmark },
    });

    // Update exam-list
    if (response.success) {
      console.log("response", response);
      // Find exam by id
      const examIndex = exams.value.findIndex((e) => e.id === exam.id);
      if (examIndex !== -1) {
        // Update the bookmark status of the exam
        exams.value[examIndex].bookmark = !exams.value[examIndex].bookmark;
      }
      toast.add({
        severity: "success",
        summary: "Success",
        detail: response?.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Failed to update bookmark:", error);
  }
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

    <!-- Display loading spinner while pending -->
    <div v-if="pending" class="w-full h-full items-center justify-between">
      <Skeleton width="10rem" height="2rem" class="mb-2"></Skeleton>
      <div class="exams-card-container">
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
      </div>
      <Skeleton width="10rem" height="2rem" class="mb-2 mt-10"></Skeleton>
      <div class="exams-card-container">
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
        <Skeleton height="220px"></Skeleton>
      </div>
    </div>

    <!-- Loop through each exam category -->
    <div v-else v-for="(category, index) in categories" :key="index">
      <h2 class="exam-category-title">
        {{ index + 1 }}. {{ category.category }}
      </h2>

      <!-- Display exam cards with pagination -->
      <div class="exams-card-container">
        <ExamCard
          v-for="exam in getPaginatedExams(category.id)"
          :key="exam.id"
          :exam="exam"
          @update-bookmark="updateBookmark"
          @fetchExams="fetchExamsAndCategories"
        />
      </div>

      <!-- Pagination for each category -->
      <div class="pagination-controls">
        <Paginator
          v-if="getTotalRecords(category.id) > 0"
          :rows="rowsPerPageState[category.id] || defaultRowsPerPage"
          :totalRecords="getTotalRecords(category.id)"
          :first="
            (pageState[category.id] || 0) *
            (rowsPerPageState[category.id] || defaultRowsPerPage)
          "
          @page="(e) => onPageChange(category.id, e)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
