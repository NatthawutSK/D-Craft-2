<script setup>
import { LoadingIndicator, createResource, toast } from 'frappe-ui';
import _ from 'lodash';
import { useRoute, useRouter } from 'vue-router';
import MultiInputForm from '../components/MultiInputForm.vue';
import { ChangeStatus, CreateTask } from '../utils';
import { MapStatus, MapDisplayData } from '../data/mapData';
import { isArray } from '../utils';


const router = useRouter();
// Access route parameters
const route = useRoute();
const group_id = route.params.group_id;
// const status = route.params.status;

// Method to navigate to the task detail page
const goDetail = (core_id, status) => {
    router.push({ name: 'DetailTask', params: { core_id: core_id, status: status } });
};
const mapLabel = (key) => {
    return MapDisplayData[key] || key;
};

let detailGroup = createResource({
    url: 'get_detail_group',
    method: 'POST',
})
detailGroup.fetch({
    group_id: group_id,
});


// Handle form submission in the parent component
const handleFormSubmit = async () => {
    const core_ids = detailGroup.data.group_data.map((task) => task.core_id);
    let isError = false;

    for (const core_id of core_ids) {
        // Create task for each core_id
        await CreateTask({
            status: "Doing",
            data: {
                core_link: core_id,
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
            },
        });

        if (!isError) {
            // Change status for each core_id after successful task creation
            await ChangeStatus({ core_id: core_id, status: "Doing" });
        } else {
            // If there was an error, break out of the loop
            break;
        }
    }

    if (!isError) {
        // Navigate to home page or another action after all tasks are processed successfully
        router.push({ name: 'Home' });
    }
};

// Function to calculate total price
const calculateTotalPrice = (groupData) => {
    if (!groupData) return 0;
    return groupData.reduce((total, task) => {
        return total + (parseFloat(task.prev_data.price) || 0);
    }, 0);
};

</script>

<template>
    <!-- <pre>{{ detailGroup.data }}</pre> -->
    <!-- Loading Indicator -->
    <div v-if="detailGroup.loading" class="loading-container">
        <LoadingIndicator class="loading-indicator" />
    </div>
    <div v-else class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <!-- Group Information -->
        <div class="mb-8 border-b pb-6">
            <h2 class="text-2xl font-bold mb-4">ข้อมูลกลุ่มงาน</h2>
            <p class="text-lg text-gray-700"><strong>รหัสกลุ่ม:</strong> {{ detailGroup.data.group_id }}</p>
            <p class="text-lg text-gray-700"><strong>ราคารวม:</strong> {{
                calculateTotalPrice(detailGroup.data.group_data) }}</p>
            <p class="text-lg text-gray-700"><strong>จำนวนงาน:</strong> {{ detailGroup.data.group_data.length }}
            </p>
        </div>

        <!-- Task List -->
        <ul>
            <li v-for="(task, index) in detailGroup.data.group_data" :key="index"
                class="mb-6 p-6 border rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="font-bold text-xl">{{ task.task }}</div>
                <div class="text-gray-600 mt-2">Status: {{ MapStatus[task.status] }}</div>
                <div v-if="task.prev_data" class="mt-4 text-base">
                    <div v-for="(value, key) in task.prev_data" :key="key" class="flex items-center">
                        <span class="font-semibold">{{ mapLabel(key) }}:</span>
                        <span class="text-gray-800 ml-3">
                            <span v-if="isArray(value)">
                                {{ JSON.parse(value).join(', ') }}
                            </span>
                            <span v-else>
                                {{ value }}
                            </span>
                        </span>
                    </div>
                </div>
                <button @click="goDetail(task.core_id, task.status)"
                    class="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    ดูรายละเอียด
                </button>
            </li>
        </ul>
        <button @click="handleFormSubmit" class="bg-blue-700 text-white px-4 py-2  rounded-md hover:bg-blue-500 w-full"
            :data-testid="'button-submit-group'">
            รับงานทั้งหมด</button>
    </div>
</template>