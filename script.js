document.addEventListener('DOMContentLoaded', () => {
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const resultsSection = document.getElementById('results-section');
    let data = null;

    // Fetch the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateDropdowns();
            addEventListeners();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            resultsSection.innerHTML = '<p class="placeholder-text">Error: Could not load data.json</p>';
        });

    function populateDropdowns() {
        const categories = data.categories;
        for (const id in categories) {
            const option1 = new Option(categories[id], id);
            const option2 = new Option(categories[id], id);
            dropdown1.add(option1);
            dropdown2.add(option2);
        }
    }

    function addEventListeners() {
        dropdown1.addEventListener('change', lookupAndDisplay);
        dropdown2.addEventListener('change', lookupAndDisplay);
    }

    function lookupAndDisplay() {
        const val1 = dropdown1.value;
        const val2 = dropdown2.value;

        // Clear results if dropdowns are not selected or are the same
        if (!val1 || !val2 || val1 === val2) {
            resultsSection.innerHTML = '<p class="placeholder-text">Please select two different trends to see the results.</p>';
            return;
        }

        // Check for the combination in both orders (e.g., 5-1 and 1-5)
        let itemIds = null;
        if (data.lookup[val1] && data.lookup[val1][val2]) {
            itemIds = data.lookup[val1][val2];
        } else if (data.lookup[val2] && data.lookup[val2][val1]) {
            itemIds = data.lookup[val2][val1];
        }

        if (itemIds) {
            displayResults(itemIds);
        } else {
            resultsSection.innerHTML = '<p class="placeholder-text">No data found for this combination.</p>';
        }
    }

    function displayResults(itemIds) {
        resultsSection.innerHTML = ''; // Clear previous results
        itemIds.forEach(id => {
            const item = data.items[id];
            if (item) {
                const imageUrl = `img/${id}.webp`;
                const cardHTML = `
                    <div class="item-card">
                        <div class="item-image-container">
                            <img src="${imageUrl}" alt="${item.name}" class="item-image">
                        </div>
                        <div class="item-details">
                            <h2 class="item-name">${item.name}</h2>
                            <div class="item-zone-container">
                                <p class="item-zone">Former Research Center ${item.zone}</p>
                            </div>
                        </div>
                    </div>
                `;
                resultsSection.innerHTML += cardHTML;
            }
        });
    }
});