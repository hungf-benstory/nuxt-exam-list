<script setup>
definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});
import ExamCard from "@/components/ExamCard.vue";
import { ref, computed, onMounted } from "vue";
import { API_ENDPOINTS } from "~/utils/api";
const { $api } = useNuxtApp();
const toast = useToast();
const exams = ref([]);
const categories = ref([]);
const pending = ref(false);
const error = ref(null);

const fetchExams = async () => {
  pending.value = true;
  try {
    const endpoint = API_ENDPOINTS.exams.getExams;
    // Call API
    const response = await $api({
      url: endpoint.url, // API url
      method: endpoint.method,
    });
    exams.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
  setTimeout(() => {
    pending.value = false;
  }, 600);
};

const fetchCategories = async () => {
  pending.value = true;
  try {
    const endpoint = API_ENDPOINTS.exams.getCategories;
    // Call API
    const response = await $api({
      url: endpoint.url, // API url
      method: endpoint.method,
    });
    categories.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
  setTimeout(() => {
    pending.value = false;
  }, 600);
};

// Call api
onMounted(() => {
  fetchExams();
  fetchCategories();
});

// Data exam bookmarked
const bookmarkedExams = computed(() => {
  return categories.value.reduce(
    (result, category) => {
      // Filter exam by categoryId
      const items = exams.value.filter(
        (exam) => exam.categoryId === category.id && exam.bookmark
      );

      // Add category if exam bookmarked
      if (items.length > 0) {
        result.push({ ...category, items });
      }

      return result;
    },
    [categories]
  );
});

// Function update status bookmark
const updateBookmark = async (exam) => {
  try {
    const endpoint = API_ENDPOINTS.exams.updateBookmark;

    // Call API
    const response = await $api({
      url: endpoint.url, // API url
      method: endpoint.method,
      data: { id: exam.id, bookmark: !exam.bookmark },
    });

    if (response.status === 200) {
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
    console.error(error);
  }
};
</script>

<template>
  <div class="exam-list">
    <!-- Show skeleton when loading data -->
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

    <!-- exam bookmarked -->
    <div v-else>
      <div
        class="py-6"
        v-for="(examCategory, index) in bookmarkedExams"
        :key="index"
      >
        <!-- Categories -->
        <h2 class="exam-category-title">
          {{ examCategory.category }}
        </h2>

        <!-- Show ExamCards -->
        <div class="exams-card-container">
          <ExamCard
            v-for="exam in examCategory.items"
            :key="exam.id"
            :exam="exam"
            @update-bookmark="updateBookmark(exam)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
