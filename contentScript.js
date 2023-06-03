// Replace with your own API key
const aK = "YOUR API KEY HERE";

// Define a global variable to keep track of the processed video IDs
// let processedVideoIds = [];

// Function to hide videos based on category
function hideVideos(allowedCategoryIds) {
  // Get all video links on the page
  const videoLinks = Array.from(document.querySelectorAll("a.ytd-thumbnail"));

  // Extract video IDs from the video links
  const videoIds = videoLinks
    .map((link) => {
      if (link.href) {
        try {
          const url = new URL(link.href);
          return url.searchParams.get("v");
        } catch (e) {
          console.error("Failed to construct URL:", link.href);
        }
      }
    })
    .filter(Boolean); // remove nulls

  // Remove video IDs that have already been processed
  // const unprocessedVideoIds = videoIds.filter(
  //   (videoId) => !processedVideoIds.includes(videoId)
  // );
  // console.log(`{unprocessedVideoIds}.join(",") is `, unprocessedVideoIds.join(","));

  // Fetch video data from the YouTube Data API for all unprocessed video IDs
  if (videoIds.length > 0) {
    const aK = "YOUR API KEY HERE";
    fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(",")}&key=${aK}&part=snippet`)
      .then((response) => response.json())
      .then((data) => {
        if(!data.items) {
          console.log("data.items is undefined")
          return;
        }
        data.items.forEach((item) => {
          const videoId = item.id;
          const categoryId = Number(item.snippet?.categoryId);
          if (!categoryId) {
            console.error(`Failed to get category ID for video ${videoId}`);
            return;
          }

          // If the video's category ID is not in the allowed category IDs, hide the video
          if (!allowedCategoryIds.includes(categoryId)) {
            console.log(`going to hide video whose categoryId is ${categoryId}`)
            let videoElement = document.querySelector(
              `a[href*="/watch?v=${videoId}"]`
            );
            let dismissibleDiv = videoElement.closest("#dismissible");
            if (dismissibleDiv) {
              dismissibleDiv.style.display = "none";
              //remove the elemt from the DOM
              dismissibleDiv.remove();
            } else {
              console.error(`Failed to find element for video ${videoId}`);
            }
          }

          // Add the video ID to the processed video IDs array

          // processedVideoIds.push(videoId);
          // console.log(`Video ${videoId} processed and it the category is ${categoryId}`);
        });
      })
      .catch((err) => {
        console.error("Error fetching video data:", err);
      });
  }
}
// Get the allowed category IDs from Chrome's storage
chrome.storage.local.get(["allowedCategoryIds"], (result) => {
  console.log("result.allowedCategoryIds is ", result.allowedCategoryIds)
  if (chrome.runtime.lastError) {
    console.error(
      "Failed to get allowedCategoryIds from storage:",
      chrome.runtime.lastError
    );
    return;
  }
  
  const allowedCategoryIds = result.allowedCategoryIds;

  console.log("allowedCategoryIds is ", allowedCategoryIds)
  if (!allowedCategoryIds) {
    console.error("allowedCategoryIds is undefined.");
    return;
  }

  // Call hideVideos initially
  hideVideos(allowedCategoryIds);

  let observer = new MutationObserver(() => {
    hideVideos(allowedCategoryIds);
    // Stop observing to avoid infinite loop
    observer.disconnect();

    // Use setTimeout to delay the execution of your logic
    setTimeout(() => {
      // Your logic goes here
      // Restart observing
      observer.observe(document, { childList: true, subtree: true });
    }, 1500); // Delay for 1.5 seconds
  });

  // Start observing the document with the configured parameters
  observer.observe(document, { childList: true, subtree: true });
});
