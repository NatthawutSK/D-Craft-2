<script setup>
import { ref, watch } from 'vue';
import { Input } from 'frappe-ui';

// Props
const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: 'Label'
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    fieldName: {
        type: String,
        required: true
    },
    nonEdit: { // Add the nonEdit prop
        type: Boolean,
        default: false
    },
    dataTestId: { // Add the dataTestId prop
        type: String,
        default: ''
    }
});

// Add a placeholder to the options array only for select type
// const optionsWithPlaceholder = ref([]);
// if (props.type === 'select') {
//     optionsWithPlaceholder.value = [{ label: 'กรุณาเลือก', value: '' }, ...props.options.map(option => {
//         return { label: option, value: option };
//     })];
// }

// Emits
const emit = defineEmits(['update:modelValue']);

// Local state
const inputValue = ref(props.modelValue);


// Watch for changes in local state and emit update
watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// Watch for changes in props and update local state
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue;
});
</script>
<template>
    <div class="mb-4">
        <label :for="fieldName" class="block text-md font-medium text-gray-700">
            {{ label }}
        </label>
        <!-- Conditional rendering for input or textarea -->
        <input v-if="type !== 'textarea'" v-model="inputValue" :id="fieldName" :type="type" :placeholder="placeholder"
            :disabled="nonEdit" :data-testid="dataTestId" :class="{
                'mt-1 block rounded-sm border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm': true,
                ' w-full': type !== 'checkbox'
            }" />
        <textarea v-else v-model="inputValue" :id="fieldName" :placeholder="placeholder" :disabled="nonEdit"
            :data-testid="dataTestId"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    </div>
</template>
