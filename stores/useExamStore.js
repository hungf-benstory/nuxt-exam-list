import { ref } from "vue";
import { defineStore } from "pinia";

// Import data from file mock
import categoryExam from "@/mock/categoryExam.js";
import examList from "@/mock/examList.js";

export const useExamStore = defineStore("examStore", () => {
  // Check if running on the client side
  const getLocalStorageItem = (key, fallback) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    }
    return fallback;
  };

  // state
  const categories = ref(getLocalStorageItem("categories", categoryExam));
  const exams = ref(getLocalStorageItem("exams", examList));

  // Action update exam-list
  const setExamList = (newExams) => {
    exams.value = newExams;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("exams", JSON.stringify(newExams));
    }
  };

  // Action update bookmark
  const updateBookmark = (examBookmark) => {
    exams.value = exams.value.map((exam) =>
      exam.id === examBookmark.id ? examBookmark : exam
    );
    if (typeof window !== "undefined" && window.localStorage) {
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
