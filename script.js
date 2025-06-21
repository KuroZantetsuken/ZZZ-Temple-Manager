document.addEventListener('DOMContentLoaded', () => {
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const resultsSection = document.getElementById('results-section');
    let data = null;
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
        const fragment1 = document.createDocumentFragment();
        const fragment2 = document.createDocumentFragment();
        for (const id in categories) {
            const option1 = new Option(categories[id], id);
            const option2 = new Option(categories[id], id);
            fragment1.appendChild(option1);
            fragment2.appendChild(option2);
        }
        dropdown1.appendChild(fragment1);
        dropdown2.appendChild(fragment2);
    }
    function addEventListeners() {
        dropdown1.addEventListener('change', handleSelectionChange);
        dropdown2.addEventListener('change', handleSelectionChange);
    }
    function handleSelectionChange() {
        resultsSection.classList.add('fade-out');
        resultsSection.addEventListener('transitionend', () => {
            lookupAndDisplay();
            resultsSection.classList.remove('fade-out');
        }, { once: true });
    }
    function lookupAndDisplay() {
        const val1 = dropdown1.value;
        const val2 = dropdown2.value;
        if (!val1 || !val2 || val1 === val2) {
            resultsSection.innerHTML = '<p class="placeholder-text">Please select two different trends to see the results.</p>';
            return;
        }
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
        resultsSection.innerHTML = '';
        const fragment = document.createDocumentFragment();
        itemIds.forEach(id => {
            const item = data.items[id];
            if (item) {
                const imageUrl = `img/${id}.webp`;
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <div class="item-image-container">
                        <img src="${imageUrl}" alt="${item.name}" class="item-image">
                    </div>
                    <div class="item-name-container">
                        <p class="item-name">${item.name}</p>
                    </div>
                    <div class="item-zone-container">
                        <p class="item-zone">Former Research Center ${item.zone}</p>
                    </div>
                `;
                fragment.appendChild(card);
            }
        });
        resultsSection.appendChild(fragment);
    }
});