<template>
    <div class="space-y-6">
        <div v-for="field in fields" :key="field.fieldName">
            <!-- Image Field -->
            <div v-if="field.type === 'image'">
                <label :for="field.label" class="block mb-2 text-md font-medium text-gray-700">{{ field.label }}</label>
                <FileUploader v-if="!field.nonEdit" :accept="'image/*'" :data-field-name="field.fieldName"
                    :data-testid="'input-' + field.fieldName" @success="(file) => handleFile(file, field.fieldName)"
                    @error="handleError" class="w-full">
                    <template v-slot="{ openFileSelector, uploading, progress }">
                        <div>
                            <button @click="openFileSelector" :loading="uploading"
                                :data-testid="'button-' + field.fieldName"
                                class="px-3 py-1 border border-black text-black text-sm rounded hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50">
                                {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
                            </button>
                        </div>
                    </template>
                </FileUploader>
                <!-- Image preview -->
                <div v-if="formData[field.fieldName]" class="mt-2 text-center">
                    <img :src="formData[field.fieldName]" alt="Image preview"
                        class="w-32 h-32 object-cover rounded-md shadow-md"
                        :data-testid="'image-preview-' + field.fieldName" />
                </div>
            </div>

            <!-- Date and Datetime Fields -->
            <div v-else-if="field.type === 'datetime'">
                <label :for="field.label" class="mb-2 block text-md font-medium text-gray-700">{{ field.label }}</label>
                <VueDatePicker v-model="formData[field.fieldName]" text-input
                    :data-testid="'input-' + field.fieldName" />
            </div>
            <div v-else-if="field.type === 'date'">
                <label :for="field.label" class="block mb-2 text-md font-medium text-gray-700">{{ field.label }}</label>
                <VueDatePicker v-model="formData[field.fieldName]" :enable-time-picker="false" text-input
                    :data-testid="'input-' + field.fieldName" />
            </div>

            <!-- Password Field with Show/Hide Toggle and Styled Input -->
            <div v-else-if="field.fieldName === 'password'" class="relative">
                <label :for="field.label" class="block mb-2 text-md font-medium text-gray-700">{{ field.label }}</label>
                <div class="relative">
                    <input :type="field.showPassword ? 'text' : 'password'" v-model="formData[field.fieldName]"
                        :id="field.fieldName" :placeholder="field.label" :disabled="field.nonEdit"
                        :data-testid="'input-' + field.fieldName" :class="{
                            'mt-1 block rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm': true,
                            'w-full': true
                        }" />
                    <button type="button" @click="togglePasswordVisibility(field)"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        {{ field.showPassword ? 'Hide' : 'Show' }}
                    </button>
                </div>
            </div>

            <!-- Multiselect Fields -->
            <div v-else-if="field.type === 'multiselect'">
                <label :for="field.label" class="block mb-2 text-md font-medium text-gray-700">{{ field.label }}</label>
                <Multiselect v-model="formData[field.fieldName]" :options="field.options" :multiple="true"
                    :searchable="false" :taggable="true" @tag="newTag => formData[field.fieldName].push(newTag)"
                    :data-testid="'input-' + field.fieldName" />
            </div>

            <!-- Select Fields -->
            <div v-else-if="field.type === 'select'">
                <label :for="field.label" class="block mb-2 text-md font-medium text-gray-700">{{ field.label }}</label>
                <Multiselect v-model="formData[field.fieldName]" :options="field.options" :multiple="false"
                    openDirection="bottom" placeholder="Select an option" :searchable="false"
                    :data-testid="'input-' + field.fieldName" />
            </div>

            <!-- Other Fields -->
            <ReusableInput v-else v-model="formData[field.fieldName]" :label="field.label" :type="field.type"
                :placeholder="field.label" :fieldName="field.fieldName" :nonEdit="field.nonEdit"
                :options="field.options || []" :data-testid="'input-' + field.fieldName" />
        </div>
        <button v-if="IsButtonShow[status] !== false" @click="handleSubmit"
            class="bg-blue-700 text-white px-4 py-2  rounded-md hover:bg-blue-500 w-full"
            :data-testid="'button-submit'">
            {{ ButtonLabel[status] || "บันทึก" }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ReusableInput from './ReusableInput.vue';
import Multiselect from 'vue-multiselect';
import { FileUploader } from 'frappe-ui';
import dayjs from 'dayjs';
import { ButtonLabel, IsButtonShow } from '../data/mapData';

// Receive fields as a prop
const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default: []
    },
    // isShowButton: {
    //     type: Boolean,
    //     default: true
    // },
    status: {
        type: String,
        default: ''
    }
});

// Function to format datetime using dayjs
// const formatDateTime = (date) => {
//     return dayjs(date).format('YYYY-MM-DD HH:mm:ss');  // Format as 'YYYY-MM-DD HH:mm:ss'
// };

// // Function to format date only using dayjs
// const formatDate = (date) => {
//     return dayjs(date).format('YYYY-MM-DD');  // Format as 'YYYY-MM-DD'
// };


// Initialize form data
const formData = ref(
    (props.fields || []).reduce((acc, field) => {
        acc[field.fieldName] = field.value || (field.type === 'image' ? '' : '');
        return acc;
    }, {})
);

props.fields.forEach((field) => {
    if (field.type === 'password') {
        field.showPassword = false;
    }
});

// Toggle password visibility
const togglePasswordVisibility = (field) => {
    field.showPassword = !field.showPassword;
};

// Handle image upload
const handleFile = (file, fieldName) => {
    console.log('Image uploaded:', file);
    console.log('Field name:', fieldName);

    // Assuming file.url contains the URL of the uploaded image
    if (file && file.file_url) {
        formData.value[fieldName] = file.file_url;
    } else {
        // Handle error case
        console.error('Failed to upload the image.');
    }
};

// Handle error
const handleError = (error) => {
    console.error('Upload error:', error);
};

// Emit the form data to the parent component
const emit = defineEmits(['submit']);

// Handle form submission
const handleSubmit = () => {
    const formDataToSubmit = { ...formData.value };

    // Loop through fields to stringify multiselect field data
    props.fields.forEach((field) => {
        if (field.type === 'multiselect' && Array.isArray(formDataToSubmit[field.fieldName])) {
            formDataToSubmit[field.fieldName] = JSON.stringify(formDataToSubmit[field.fieldName]);
        } else if (field.type === 'datetime' && formDataToSubmit[field.fieldName]) {
            // Format datetime field data
            formDataToSubmit[field.fieldName] = dayjs(formDataToSubmit[field.fieldName]).format('YYYY-MM-DD HH:mm:ss');
        } else if (field.type === 'date' && formDataToSubmit[field.fieldName]) {
            // Format date field data
            formDataToSubmit[field.fieldName] = dayjs(formDataToSubmit[field.fieldName]).format('YYYY-MM-DD');
        } else if (field.type === 'checkbox' && !formDataToSubmit[field.fieldName]) {
            formDataToSubmit[field.fieldName] = false;
        }
    });

    emit('submit', formDataToSubmit);
};
</script>
