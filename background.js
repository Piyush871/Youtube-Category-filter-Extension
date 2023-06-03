try
{

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo && changeInfo.status === 'complete') {
        if (tab.url.includes('https://www.youtube.com/results?search_query')) {
            chrome.storage.local.get(['allowedCategoryIds'], result => {
                const allowedCategoryIds = result.allowedCategoryIds;
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['contentScript.js']
                });
            });
        }
    }
});
}
catch (err) {
  console.log(err);
}