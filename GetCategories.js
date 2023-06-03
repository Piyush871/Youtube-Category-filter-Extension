const axios = require('axios');
const fs = require('fs');

const apiKey = 'AIzaSyDMcKwkji6zy6TemzibGqeibkUFaKOIWfo';  // replace this with your actual API key

const fetchCategoryName = async (categoryId) => {
    const url = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&id=${categoryId}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.items.length > 0) {
            return response.data.items[0].snippet.title;
        }
    } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error.message);
    }
    return null;
};

const fetchAndWriteCategories = async () => {
    const writer = fs.createWriteStream('categories.txt');
    for (let categoryId = 1; categoryId <= 1000; categoryId++) {
        const categoryName = await fetchCategoryName(categoryId);
        if (categoryName) {
            writer.write(`ID: ${categoryId}, Name: ${categoryName}\n`);
        }
    }
    writer.end();
};

fetchAndWriteCategories();
2