import { createResource, createListResource } from 'frappe-ui';
import _ from 'lodash';

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// create doc and link to core
export async function CreateTask({ status, data, onErrorToast }) {
    let errorMandatory = null;

    try {
        let tasks = createListResource({
            doctype: status,
            insert: {
                onSuccess(e) {
                    // Task creation successful
                },
                onError(e) {
                    console.log("e, e", e);
                    if (e?.error?.messages && Array.isArray(e.error.messages) && e.error.messages.length > 0) {
                        errorMandatory = e.error.messages
                    }
                }
            }
        });

        // Wait for the insert operation to complete and get the response
        const res = await tasks.insert.submit(data);

        // Assuming the response contains the new item's ID
        const newItemId = res?.name;

        // Link to core and update needed fields
        let linkCore = createResource({
            url: 'link_core',
            method: 'POST',
        });

        await linkCore.fetch({
            status: status,
            link_id: newItemId,
            core_id: data.core_link ? data.core_link : null
        });

        // Keep data
        let keepData = createResource({
            url: 'keep_prev_data',
            method: 'POST',
        });

        await keepData.fetch({
            doctype: status,
            core_id: linkCore.data,
            data: _.omit(data, ['core_link'])
        });

    } catch (e) {
        // Handle any errors not caught by the onError callbacks
        const errorMessage = errorMandatory ? errorMandatory.join(', ') : e.message;
        onErrorToast(new Error(errorMessage));
    }
}

export async function ChangeStatus({ core_id, status }) {
    let changeStatus = createResource({
        url: 'change_status',
        method: 'POST',
    })
    await changeStatus.fetch({
        doc_id: core_id,
        to_status: status,
    });

}

export const isArray = (value) => {
    try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue);
    } catch (e) {
        return false;
    }
};