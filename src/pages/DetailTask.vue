<script setup>
import { LoadingIndicator, createResource, toast } from 'frappe-ui';
import _ from 'lodash';
import { useRoute, useRouter } from 'vue-router';
import MultiInputForm from '../components/MultiInputForm.vue';
import { ChangeStatus, CreateTask } from '../utils';


const router = useRouter();
// Access route parameters
const route = useRoute();
const core_id = route.params.core_id;
const status = route.params.status;


let detailTask = createResource({
    url: 'get_detail_task',
    method: 'POST',
    transform(data) {
        const [withValue, withoutValue] = _.partition(data.schema, item => _.has(item, 'value'));
        console.log("withValue", withValue);
        console.log("withoutValue", withoutValue);

        return {
            toDisplay: withValue,
            toEdit: withoutValue,
            nextStatus: data.status
        }
    }
})
detailTask.fetch({
    core_id: core_id,
});


// Handle form submission in the parent component
const handleFormSubmit = async (formData) => {
    console.log('Form data submitted:', formData);
    const nextStatus = detailTask.data.nextStatus
    console.log("nextStatus", nextStatus);

    let isError = false;
    await CreateTask({
        status: nextStatus,
        data: {
            ...formData,
            core_link: core_id
        },
        onErrorToast: (error) => {
            console.log('Error:', error);
            isError = true;
            toast({
                title: 'Error',
                text: error.message || 'An error occurred during task creation.',
                icon: 'x',
                iconClasses: 'text-red-500',
            });
        }
    });

    if (!isError) {
        await ChangeStatus({ core_id: core_id, status: nextStatus })
        router.push({ name: 'Home' })
    }


};


</script>

<template>
    <!-- <h1>Core ID: {{ core_id }}</h1>
    <h1>Status: {{ status }}</h1>
    <h1>Next Status: {{ detailTask.data.nextStatus }}</h1> -->
    <!-- <pre>{{ getNextStatus.data }}</pre>
    <pre>{{ detailTask.data }}</pre> -->
    <div class="py-10">
        <div v-if="detailTask.loading" class="loading-container">
            <LoadingIndicator class="loading-indicator" />
        </div>

        <div v-else class="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <div class="space-y-2 mb-6">
                <div v-for="item in detailTask.data.toDisplay" :key="item.fieldName"
                    class="flex flex-col sm:flex-row border-b border-gray-200 pb-2 last:border-none">
                    <span class="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">{{ item.label }}:</span>
                    <span v-if="item.type === 'image'">
                        <img :src="item.value" alt="Image preview"
                            class="w-32 h-32 object-cover rounded-md shadow-md" />

                    </span>
                    <span v-else-if="item.type === 'multiselect'">
                        {{ JSON.parse(item.value).join(", ") }}
                    </span>
                    <span v-else class="text-gray-900 break-words w-full sm:w-2/3">{{ item.value }}</span>
                </div>
            </div>

            <MultiInputForm :status="status" :fields="detailTask.data.toEdit" @submit="handleFormSubmit" />
        </div>
    </div>
</template>