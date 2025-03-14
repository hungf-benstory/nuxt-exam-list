<script setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const isLoading = ref(false);

// Define props
const props = defineProps({
  exam: {
    type: Object,
    required: true,
  },
  fetchExams: Function,
});

// Emit bookmark update
const emit = defineEmits(["update-bookmark", "fetchExams"]);
const toggleBookmark = () => {
  emit("update-bookmark", { ...props.exam, bookmark: props.exam.bookmark });
};

// Check if the exam end date has passed
const isEndDatePast = computed(() =>
  dayjs(props.exam.endDate).isBefore(dayjs())
);

// Status and button labels
const statusText = computed(() =>
  props.exam.status === 0 ? "Incomplete" : "Completed"
);
const statusClass = computed(() =>
  props.exam.status === 0 ? "text-orange-500" : "text-green-500"
);

//label button Start Exam
const labelButton = computed(() =>
  props.exam.status === 0 ? "Start Exam" : "View Results"
);
const isStatusIncomplete = computed(() => props.exam.status < 1);

// Check if the end date is one day away
const isEndDateInOneDay = computed(() =>
  dayjs(props.exam.endDate).isSame(dayjs().add(1, "day"), "day")
);

// Disable button if the end date has passed and the exam is incomplete
const isDisabled = computed(() => {
  return isEndDatePast.value && isStatusIncomplete.value;
});

// Handle start the exam
const startExam = () => {
  isLoading.value = true;
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Starting the exam!",
    life: 3000,
  });
  isLoading.value = false;
};

const onDelete = async (id) => {
  const { data, error } = await useFetch("/api/exams", {
    method: "DELETE",
    body: {
      id: id,
    },
  });

  if (error.value) {
    console.error("Error ", error.value);
  } else {
    console.log("Exam dell:", data.value);
    emit("fetchExams");
  }
};
</script>

<template>
  <div
    :class="[
      'exam-card',
      isDisabled && 'border border-red-500',
      isEndDateInOneDay && 'border border-yellow-500',
    ]"
  >
    <div class="exam-card-title">
      <!-- Exam title -->
      <h3 class="exam-title">
        {{ props.exam.title }}
      </h3>

      <!-- Bookmark icon -->
      <button @click="toggleBookmark" class="bookmark-icon">
        <i v-if="props.exam.bookmark" class="pi pi-bookmark-fill"></i>
        <i v-else class="pi pi-bookmark"></i>
      </button>
    </div>

    <!-- Date range section -->
    <div class="date-range">
      {{ props.exam.startDate }} ~ {{ props.exam.endDate }}
    </div>

    <!-- Duration Section -->
    <div class="duration">
      Duration: <span>{{ props.exam.duration }} min</span>
    </div>

    <!-- Exam status -->
    <p class="status">
      Status: <span :class="statusClass">{{ statusText }}</span>
    </p>

    <!-- message exam expired -->
    <div class="min-h-8">
      <p
        v-show="isEndDatePast && isStatusIncomplete"
        class="exam-expired-message"
      >
        This exam has expired!
      </p>
    </div>

    <!-- Start Exam button  -->
    <Button
      :label="labelButton"
      :loading="isLoading"
      :disabled="isDisabled"
      class="start-exam-button"
      @click="startExam"
    />
  </div>
</template>

<style scoped></style>
