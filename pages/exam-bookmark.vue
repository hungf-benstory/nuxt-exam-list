<script setup>
definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});
import ExamCard from "@/components/ExamCard.vue";
import { ref, computed, onMounted } from "vue";
const toast = useToast();
const exams = ref([]);
const categories = ref([]);
const pending = ref(false);
const error = ref(null);

const fetchExamsAndCategories = async () => {
  pending.value = true;
  try {
    // api list exams
    const { data: examsData } = await $fetch("/api/exams", {
      method: "GET",
      key: new Date().getTime(),
    });

    exams.value = examsData || [];

    // get api categories
    const { data: categoriesData } = await $fetch("/api/categories", {
      method: "GET",
      key: new Date().getTime(),
    });

    categories.value = categoriesData || [];
  } catch (err) {
    error.value = err.message || "Error fetching data";
    console.error("Error fetching data:", error.value);
  } finally {
    setTimeout(() => {
      pending.value = false;
    }, 600);
  }
};

// Call api
onMounted(() => {
  fetchExamsAndCategories();
});

// Data exam bookmarked
const bookmarkedExams = computed(() => {
  return categories.value.reduce((result, category) => {
    // Filter exam by categoryId
    const items = exams.value.filter(
      (exam) => exam.categoryId === category.id && exam.bookmark
    );

    // Add category if exam bookmarked
    if (items.length > 0) {
      result.push({ ...category, items });
    }

    return result;
  }, []);
});

// Function update status bookmark
const updateBookmark = async (exam) => {
  pending.value = true;

  try {
    // Send request to update status bookmark
    const response = await $fetch(`/api/exams`, {
      method: "PATCH",
      body: { id: exam.id, bookmark: !exam.bookmark },
    });

    // Update list bookmarked when success
    if (response.success) {
      // Find exam by id need update
      const examIndex = exams.value.findIndex((e) => e.id === exam.id);
      if (examIndex !== -1) {
        // Update status bookmarked
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
  setTimeout(() => {
    pending.value = false;
  }, 600);
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
