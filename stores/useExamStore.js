
import { ref } from "vue";
import { defineStore } from "pinia";

// Import data from file mock
import categoryExam from "@/mock/categoryExam.js";
import examList from "@/mock/examList.js";

export const useExamStore = defineStore("examStore", () => {
  // state
  const categories = ref(
    process.client
      ? JSON.parse(localStorage.getItem("categories")) || categoryExam
      : categoryExam
  );
  const exams = ref(
    process.client
      ? JSON.parse(localStorage.getItem("exams")) || examList
      : examList
  );

  // Action update exam-list
  const setExamList = (newExams) => {
    exams.value = newExams;
    if (process.client) {
      localStorage.setItem("exams", JSON.stringify(newExams));
    }
  };

  // Action update bookmark
  const updateBookmark = (examBookmark) => {
    exams.value = exams.value.map((exam) =>
      exam.id === examBookmark.id ? examBookmark : exam
    );
    if (process.client) {
      localStorage.setItem("exams", JSON.stringify(exams.value));
    }
  };

  // Return states and actions
  return {
    categories,
    exams,
    setExamList,
    updateBookmark,
  };
});
