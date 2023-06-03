// Get the input element and the buttons
const categoryIdInput = document.getElementById('category-id-input');
const saveButton = document.getElementById('save-button');
const deleteAllButton = document.getElementById('delete-all-button');

// Load the allowed category IDs from local storage
chrome.storage.local.get(['allowedCategoryIds'], result => {
    const allowedCategoryIds = result.allowedCategoryIds;
    if (allowedCategoryIds) {
        categoryIdInput.value = allowedCategoryIds.join(',');
    }
});

// Add a click event listener to the save button
saveButton.addEventListener('click', () => {
    const newCategoryIds = categoryIdInput.value
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '')
        .map(Number)
        .filter((id, index, array) => array.indexOf(id) === index);

    chrome.storage.local.get(['allowedCategoryIds'], result => {
        const allowedCategoryIds = result.allowedCategoryIds || [];
        const updatedCategoryIds = [...allowedCategoryIds, ...newCategoryIds];

        chrome.storage.local.set({allowedCategoryIds: updatedCategoryIds}, () => {
            console.log('Allowed category IDs saved:', updatedCategoryIds);
        });
    });
});

// Add a click event listener to the delete all button
deleteAllButton.addEventListener('click', () => {
    chrome.storage.local.remove(['allowedCategoryIds'], () => {
        console.log('Allowed category IDs deleted.');
    });
});