<script setup>
import { createResource, LoadingIndicator, ErrorMessage, toast, Button } from 'frappe-ui';
import MultiInputForm from '../components/MultiInputForm.vue';
import { CreateTask } from '../utils';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';


const router = useRouter();


const firstStatus = createResource({
    url: 'get_first_status',
    auto: false, // Disable automatic fetching to manually control when to fetch
});

const schema = createResource({
    url: 'get_schema',
    auto: false, // Disable automatic fetching
});

const isSchemaLoaded = ref(false); // Track schema loading status

// Async function to fetch both resources
const fetchResources = async () => {
    try {
        // Fetch the first resource
        await firstStatus.fetch();

        // Check if the first resource fetch was successful and has valid data
        if (firstStatus.data) {
            // Fetch the second resource
            await schema.fetch({ doctype: firstStatus.data });
        }
    } catch (error) {
        // Handle any errors that occur during fetching
        toast({
            title: 'Error',
            text: error.message || 'An error occurred while fetching resources.',
            icon: 'x',
            iconClasses: 'text-red-500',
        });
    }
};

onMounted(fetchResources);

// Watch for schema data and ensure it is available before rendering form
watch(
    () => schema.data,
    (newSchemaData) => {
        if (newSchemaData) {
            isSchemaLoaded.value = true;
        }
    }
);


// Handle form submission in the parent component
const handleFormSubmit = async (formData) => {
    console.log('Form data submitted:', formData);
    const status = firstStatus.data;
    let isError = false;
    await CreateTask({
        status: status,
        data: {
            ...formData
        },
        onErrorToast: (error) => {
            isError = true;
            console.log('Error:', error);

            toast({
                title: 'Error',
                text: error.message || 'An error occurred during task creation.',
                icon: 'x',
                iconClasses: 'text-red-500',
            });
        }
    });

    if (!isError) {
        router.push({ name: 'Home' });
    }

};


</script>

<template>
    <div class="py-10">
        <!-- <pre>{{ schema.data }}</pre>
        <pre>{{ firstStatus.data }}</pre> -->
        <div v-if="isSchemaLoaded" class="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <MultiInputForm status="Create" :fields="schema.data" @submit="handleFormSubmit" />
            <div id="schema-container" :data-schema="JSON.stringify(schema.data)" style="display:none;"></div>
        </div>
        <div v-else class="loading-container">
            <LoadingIndicator class="loading-indicator" />
        </div>
    </div>
</template>
