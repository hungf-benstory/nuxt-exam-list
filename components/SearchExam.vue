<script setup>
import { ref, watch } from "vue";
import { debounce } from "lodash";

// Define props
const props = defineProps({
  modelValue: String,
  pending: Boolean,
  placeholder: {
    type: String,
    default: "Search...", // Default placeholder text
  },
});

// Emit events
const emit = defineEmits(["update:modelValue", "update:pending"]);

const inputValue = ref(props.modelValue);

// Watch for changes to modelValue from the parent and update inputValue accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

// Debounced function to emit the updated modelValue after a delay
const debouncedEmit = debounce((newValue) => {
  // Emit the updated modelValue to the parent
  emit("update:modelValue", newValue);
  // Set pending to false once search is complete
  emit("update:pending", false);
}, 500);

// Function triggered when the user starts typing
const handleInput = () => {
  // Set pending to true when search starts
  emit("update:pending", true);
  // Call the debounced function to emit modelValue after delay
  debouncedEmit(inputValue.value);
};
</script>

<template>
  <div>
    <!-- InputText with v-model bound to inputValue -->
    <InputText
      v-model="inputValue"
      :placeholder="placeholder"
      class="search-exam"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
</style>
