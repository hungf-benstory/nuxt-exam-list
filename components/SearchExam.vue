<script setup>
import { ref } from "vue";
import { debounce } from "lodash";

// Define props
const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
     // Default placeholder
    default: "Search...",
  },
});

// Emit update
const emit = defineEmits(["update:modelValue"]);

const inputValue = ref(props.modelValue);

// Timeout type input
const debouncedEmit = debounce((newValue) => {
  emit("update:modelValue", newValue);
}, 500);
</script>

<template>
  <div>
    <InputText
      v-model="inputValue"
      :placeholder="placeholder"
      class="search-exam"
      @input="debouncedEmit(inputValue)"
    />
  </div>
</template>

<style scoped></style>
