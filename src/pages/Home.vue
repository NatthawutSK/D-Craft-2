<script setup>
import { LoadingIndicator, createResource, createListResource } from 'frappe-ui';
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { MapStatus, MapDisplayData } from '../data/mapData';
import _ from 'lodash';
import { isArray, getCookie } from '../utils';

// Use the router instance
const router = useRouter();

// Method to navigate to the task detail page
const goDetail = (core_id, status) => {
    router.push({ name: 'DetailTask', params: { core_id: core_id, status: status } });
};

const goCreate = () => {
    router.push({ name: 'Create' });
};

// Method to navigate to the group detail page
const goGroupDetail = (group_id) => {
    router.push({ name: 'DetailGroup', params: { group_id: group_id } });
    // console.log('Group ID:', group_id);

};

let allTask = createResource({
    url: 'list_all_task',
    method: 'GET',
    auto: true,
    // cache: ['allTask'],
    transform(data) {
        // Transform data to match new schema
        return {
            tabNames: data.all_status,
            tabsData: data.group_data
        };
    },
});


let groupTask = createResource({
    url: 'get_all_group',
    method: 'GET',
    auto: true,
    // cache: ['groupTask'],
});

// Extract tab names and set active tab state when data is available
const tabNames = ref([]);
const activeTab = ref(null);
const tabsData = ref({});

const mapLabel = (key) => {
    return MapDisplayData[key] || key;
};

// let testDoc = createListResource({
//   doctype: "Core Tasks",
//   fields: ["*"],
//   auto: true,
//   // url: "http://localhost:8000/frappe.client.get_list"
// });




// Function to merge group data when there is more than one entry
const mergeGroupData = (groupData) => {
    if (groupData.length <= 1) return groupData[0];

    // Extract addresses and check if they are all the same
    const addresses = _.map(groupData, 'address');
    const uniqueAddresses = _.uniq(addresses);
    // Extract and process install_types
    const installTypes = _.map(groupData, 'install_type');
    const uniqueInstallTypes = _.uniq(installTypes);

    const merged = {
        address: uniqueAddresses.length === 1 ? uniqueAddresses[0] : _.join(uniqueAddresses, ', '),
        install_type: uniqueInstallTypes.length === 1 ? uniqueInstallTypes[0] : _.join(uniqueInstallTypes, ', '),
        item_type: _.uniq(_.flatten(_.map(groupData, (d) => JSON.parse(d.item_type)))),
        price: _.sumBy(groupData, (d) => parseFloat(d.price)),
        install_date: _.join(_.map(groupData, 'install_date'), ', '),
    };

    return merged;
};

// Watch for data changes and update tab names and active tab
watchEffect(() => {
    if (allTask.data && groupTask.data) {
        let mergedTabsData = _.cloneDeep(allTask.data.tabsData);

        const todosGroupData = _.map(groupTask.data, (group) => {
            return {
                status: 'Todos',
                group_id: group.group_id,
                group_data: group.group_data.length > 1 ? [mergeGroupData(group.group_data)] : group.group_data,
                group_length: group.group_data.length, // Add length of group_data
            };
        });

        mergedTabsData['Todos'] = _.concat(mergedTabsData['Todos'] || [], todosGroupData);

        tabNames.value = allTask.data.tabNames;
        tabsData.value = mergedTabsData;
        activeTab.value = tabNames.value[0] || null;
    }
});

const userId = getCookie('user_id');

</script>

<template>
    <!-- <pre>{{ testDoc.data }}</pre> -->
    <!-- <h1>XDXD</h1> -->
    <h1>{{ userId }}</h1>
    <div v-if="allTask.loading || groupTask.loading" class="loading-container">
        <LoadingIndicator class="loading-indicator" />
    </div>

    <div v-else class="flex flex-col h-screen p-6">

        <div class="flex justify-between items-center mb-4">
            <div class="flex-grow">
                <div class="flex justify-center border-b-2 bg-white z-10">
                    <div class="flex">
                        <button v-for="(tab, index) in tabNames" :key="index" @click="activeTab = tab" :class="{
                            'border-b-2 border-blue-500 text-blue-500': activeTab === tab,
                            'text-gray-500': activeTab !== tab
                        }" class="px-4 py-2 transition-colors duration-300 ease-in-out whitespace-nowrap"
                            :data-tabs="'tabs-' + index">
                            {{ MapStatus[tab] }}
                        </button>
                    </div>
                </div>
            </div>
            <button @click="goCreate"
                class="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors duration-300">
                สร้างงานใหม่
            </button>
        </div>

        <div v-if="activeTab" :key="activeTab" class="flex-grow overflow-y-auto mt-4">
            <ul>
                <template v-if="activeTab === 'Todos'">
                    <li v-for="(entry, index) in tabsData['Todos']" :key="entry.group_id || entry.core_id"
                        class="mb-2 p-4 border rounded-lg shadow-md">
                        <div v-if="entry.group_data" :data-group-id="entry.group_id">
                            <div class="font-bold">กลุ่ม: {{ entry.group_id }}</div>
                            <div class=" text-gray-500">จำนวนงาน: {{ entry.group_length }}</div>
                            <div v-for="(value, key) in entry.group_data[0]" :key="key" class="flex items-center mt-2">
                                <span class="font-bold">{{ mapLabel(key) }}:</span>
                                <span class="text-gray-500 ml-2">
                                    <span v-if="Array.isArray(value)">
                                        {{ value.join(', ') }}
                                    </span>
                                    <span v-else-if="isArray(value)">
                                        {{ JSON.parse(value).join(', ') }}
                                    </span>
                                    <span v-else>
                                        {{ value }}
                                    </span>
                                </span>
                            </div>
                            <button @click="goGroupDetail(entry.group_id)"
                                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                :data-testid="'button-detail-group-' + entry.group_id">
                                ดูรายละเอียดกลุ่มงาน
                            </button>
                        </div>
                        <div v-else :data-task-id="entry.core_id">
                            <div class="font-bold">{{ entry.task }}</div>
                            <div class="text-sm text-gray-500">สถานะ: {{ MapStatus[entry.status] }}</div>
                            <div class="font-bold">รหัสงาน: {{ entry.core_id }}</div>
                            <div v-if="entry.prev_data" class="mt-2">
                                <div v-for="(value, key) in entry.prev_data" :key="key" class="flex items-center">
                                    <span class="font-bold">{{ mapLabel(key) }}:</span>
                                    <span class="text-gray-500 ml-2">
                                        <span v-if="isArray(value)">
                                            {{ JSON.parse(value).join(', ') }}
                                        </span>
                                        <span v-else>
                                            {{ value }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <button @click="goDetail(entry.core_id, entry.status)"
                                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                :data-testid="'button-detail-' + entry.core_id">
                                ดูรายละเอียด
                            </button>
                        </div>
                    </li>
                </template>
                <template v-else>
                    <li v-for="(task, index) in tabsData[activeTab]" :key="task.core_id"
                        class="mb-2 p-4 border rounded-lg shadow-md">
                        <div :data-task-id="task.core_id">
                            <div class="font-bold">{{ task.task }}</div>
                            <div class="text-gray-500">สถานะ: {{ MapStatus[task.status] }}</div>
                            <div class="font-bold">รหัสงาน: {{ task.core_id }}</div>
                            <div v-if="!!task.assignee_name" class="font-bold">ช่างที่รับงาน: {{ task.assignee_name }}
                            </div>
                            <div v-if="task.prev_data" class="mt-2">
                                <div v-for="(value, key) in task.prev_data" :key="key" class="flex items-center">
                                    <span class="font-bold">{{ mapLabel(key) }}:</span>
                                    <span class="text-gray-500 ml-2">
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
                                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                :data-testid="'button-detail-' + task.core_id">
                                ดูรายละเอียด
                            </button>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* Ensure consistent styling for buttons */
button {
    border-width: 0 0 2px 0;
    /* Border only at the bottom */
}

button.active {
    border-color: #3b82f6;
    /* Tailwind blue-500 */
}
</style>