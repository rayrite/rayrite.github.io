// script.js

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentSort = { field: 'upvotes', direction: 'desc' };
let allTags = [];
let activeFilters = {
    search: '',
    singleTag: '',
    multiTags: [],
    sort: 'upvotes-desc'
};

// DOM elements
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const tagFilter = document.getElementById('tagFilter');
const sortBy = document.getElementById('sortBy');
const multiTagSearch = document.getElementById('multiTagSearch');
const clearAllFiltersBtn = document.getElementById('clearAllFilters');
const activeFiltersContainer = document.getElementById('activeFilters');
const tagSuggestions = document.getElementById('tagSuggestions');
const productsTableBody = document.getElementById('productsTableBody');
const totalProductsSpan = document.getElementById('totalProducts');
const filteredProductsSpan = document.getElementById('filteredProducts');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');

// ─────────────────────────────────────────────────
// 1) Setup Drag & Drop JSON support
// ─────────────────────────────────────────────────
function setupDragAndDrop() {
    document.body.addEventListener('dragover', e => {
        e.preventDefault();
        // Visual feedback
        document.body.style.outline = '4px dashed #888';
        document.body.style.outlineOffset = '-4px';
    });
    document.body.addEventListener('dragleave', e => {
        e.preventDefault();
        document.body.style.outline = '';
        document.body.style.outlineOffset = '';
    });
    document.body.addEventListener('drop', e => {
        e.preventDefault();
        document.body.style.outline = '';
        document.body.style.outlineOffset = '';

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please drop a valid JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = evt => {
            let data;
            try {
                data = JSON.parse(evt.target.result);
            } catch (err) {
                alert('Error parsing JSON: ' + err.message);
                console.error(err);
                return;
            }
            // Override products data
            allProducts = Array.isArray(data) ? data : [];
            filteredProducts = [...allProducts];

            // Reinitialize UI
            populateTagFilter();
            updateStats();
            renderTable();
            hideLoading();
        };
        reader.readAsText(file);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    loadProducts();
    setupEventListeners();
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to load products data');
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Initialize UI
        populateTagFilter();
        updateStats();
        renderTable();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products data. Please try again later.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    clearSearchBtn.addEventListener('click', clearSearch);
    
    // Multi-tag search functionality
    multiTagSearch.addEventListener('input', debounce(handleMultiTagSearch, 300));
    multiTagSearch.addEventListener('focus', showTagSuggestions);
    multiTagSearch.addEventListener('blur', hideTagSuggestions);
    
    // Filter functionality
    tagFilter.addEventListener('change', handleTagFilter);
    sortBy.addEventListener('change', handleSort);
    
    // Clear all filters
    clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Table header sorting
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            handleTableSort(sortField);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Click outside to hide suggestions
    document.addEventListener('click', (e) => {
        if (!multiTagSearch.contains(e.target) && !tagSuggestions.contains(e.target)) {
            hideTagSuggestions();
        }
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        clearSearchBtn.style.display = 'none';
    } else {
        clearSearchBtn.style.display = 'block';
    }
    
    applyFilters();
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    applyFilters();
}

// Handle tag filtering
function handleTagFilter() {
    applyFilters();
}

// Handle sorting
function handleSort() {
    const sortValue = sortBy.value;
    const [field, direction] = sortValue.split('-');
    
    currentSort = { field, direction };
    sortProducts();
    renderTable();
}

// Handle table header sorting
function handleTableSort(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'desc';
    }
    
    // Update sort dropdown to match
    const sortValue = `${currentSort.field}-${currentSort.direction}`;
    sortBy.value = sortValue;
    
    sortProducts();
    renderTable();
    updateSortIcons();
}

// Apply all filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedTag = tagFilter.value;
    const multiTagsInput = multiTagSearch.value.toLowerCase().trim();
    
    // Parse multi-tags (comma-separated)
    const multiTags = multiTagsInput ? 
        multiTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    
    // Update active filters
    activeFilters.search = searchTerm;
    activeFilters.singleTag = selectedTag;
    activeFilters.multiTags = multiTags;
    
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        // Single tag filter
        const matchesSingleTag = selectedTag === '' || 
            product.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
        
        // Multi-tag filter (all specified tags must be present)
        const matchesMultiTags = multiTags.length === 0 || 
            multiTags.every(searchTag => 
                product.tags.some(productTag => 
                    productTag.toLowerCase().includes(searchTag)
                )
            );
        
        return matchesSearch && matchesSingleTag && matchesMultiTags;
    });
    
    sortProducts();
    updateStats();
    renderTable();
    updateActiveFiltersDisplay();
}

// Sort products based on current sort settings
function sortProducts() {
    filteredProducts.sort((a, b) => {
        let aValue = a[currentSort.field];
        let bValue = b[currentSort.field];
        
        // Handle string sorting
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        // Handle numeric sorting
        if (typeof aValue === 'number') {
            return currentSort.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Handle string sorting
        if (currentSort.direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
}

// Update statistics
function updateStats() {
    totalProductsSpan.textContent = allProducts.length.toLocaleString();
    filteredProductsSpan.textContent = filteredProducts.length.toLocaleString();
    
    // Animate numbers
    animateNumber(totalProductsSpan, allProducts.length);
    animateNumber(filteredProductsSpan, filteredProducts.length);
}

// Animate number counting
function animateNumber(element, targetNumber) {
    const startNumber = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * progress);
        element.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Render the products table
function renderTable() {
    if (filteredProducts.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const tbody = productsTableBody;
    tbody.innerHTML = '';
    
    filteredProducts.forEach((product, index) => {
        const row = createProductRow(product, index);
        tbody.appendChild(row);
    });
    
    // Add fade-in animation
    tbody.style.opacity = '0';
    setTimeout(() => {
        tbody.style.transition = 'opacity 0.3s ease';
        tbody.style.opacity = '1';
    }, 50);
}

// Create a product row
function createProductRow(product, index) {
    const row = document.createElement('tr');
    row.style.animationDelay = `${index * 0.05}s`;
    row.className = 'table-row-fade-in';
    
    row.innerHTML = `
        <td>
            <a href="${product.url}" target="_blank" class="product-name" title="${escapeHtml(product.name)}">
                ${escapeHtml(product.name)}
            </a>
        </td>
        <td>
            <div class="product-description" title="${escapeHtml(product.description)}">
                ${escapeHtml(product.description) || 'No description available'}
            </div>
        </td>
        <td>
            <div class="metric-value upvotes">
                <i class="fas fa-arrow-up"></i>
                ${product.upvotes.toLocaleString()}
            </div>
        </td>
        <td>
            <div class="metric-value comments">
                <i class="fas fa-comment"></i>
                ${product.comments.toLocaleString()}
            </div>
        </td>
        <td>
            <div class="tags-container">
                ${product.tags.map(tag => 
                    `<span class="tag" onclick="filterByTag('${escapeHtml(tag)}')" title="Filter by ${escapeHtml(tag)}">${escapeHtml(tag)}</span>`
                ).join('')}
            </div>
        </td>
        <td>
            <a href="${product.url}" target="_blank" class="visit-btn" title="Visit ${escapeHtml(product.name)}">
                <i class="fas fa-external-link-alt"></i>
                Visit
            </a>
        </td>
    `;
    
    return row;
}

// Filter by tag when tag is clicked
function filterByTag(tag) {
    tagFilter.value = tag;
    applyFilters();
    
    // Scroll to top of table
    document.querySelector('.table-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Update sort icons in table headers
function updateSortIcons() {
    document.querySelectorAll('.sortable .sort-icon').forEach(icon => {
        icon.className = 'fas fa-sort sort-icon';
    });
    
    const activeHeader = document.querySelector(`[data-sort="${currentSort.field}"] .sort-icon`);
    if (activeHeader) {
        activeHeader.className = `fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'} sort-icon`;
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.focus();
    }
    
    // Escape to clear search
    if (event.key === 'Escape' && document.activeElement === searchInput) {
        clearSearch();
        searchInput.blur();
    }
}

// Handle multi-tag search
function handleMultiTagSearch() {
    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    // Reset all inputs
    searchInput.value = '';
    multiTagSearch.value = '';
    tagFilter.value = '';
    sortBy.value = 'upvotes-desc';
    
    // Reset active filters
    activeFilters = {
        search: '',
        singleTag: '',
        multiTags: [],
        sort: 'upvotes-desc'
    };
    
    // Reset sort
    currentSort = { field: 'upvotes', direction: 'desc' };
    
    // Hide clear search button
    clearSearchBtn.style.display = 'none';
    
    // Apply filters (which will show all products)
    applyFilters();
    
    // Add visual feedback
    clearAllFiltersBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clearAllFiltersBtn.style.transform = 'scale(1)';
    }, 150);
}

// Show tag suggestions
function showTagSuggestions() {
    const input = multiTagSearch.value.toLowerCase();
    const currentTags = input.split(',').map(tag => tag.trim());
    const lastTag = currentTags[currentTags.length - 1];
    
    if (lastTag.length > 0) {
        const suggestions = allTags.filter(tag => 
            tag.toLowerCase().includes(lastTag) && 
            !currentTags.slice(0, -1).some(existingTag => 
                existingTag.toLowerCase() === tag.toLowerCase()
            )
        ).slice(0, 10);
        
        if (suggestions.length > 0) {
            tagSuggestions.innerHTML = suggestions.map(tag => 
                `<div class="tag-suggestion" onclick="selectTagSuggestion('${escapeHtml(tag)}')">${escapeHtml(tag)}</div>`
            ).join('');
            tagSuggestions.style.display = 'block';
        } else {
            hideTagSuggestions();
        }
    } else {
        hideTagSuggestions();
    }
}

// Hide tag suggestions
function hideTagSuggestions() {
    setTimeout(() => {
        tagSuggestions.style.display = 'none';
    }, 200);
}

// Select tag suggestion
function selectTagSuggestion(tag) {
    const currentValue = multiTagSearch.value;
    const tags = currentValue.split(',').map(t => t.trim());
    tags[tags.length - 1] = tag;
    multiTagSearch.value = tags.join(', ') + ', ';
    hideTagSuggestions();
    multiTagSearch.focus();
    applyFilters();
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const container = activeFiltersContainer;
    container.innerHTML = '';
    
    // Search filter
    if (activeFilters.search) {
        container.appendChild(createActiveFilterTag('Search', activeFilters.search, 'search'));
    }
    
    // Single tag filter
    if (activeFilters.singleTag) {
        container.appendChild(createActiveFilterTag('Tag', activeFilters.singleTag, 'singleTag'));
    }
    
    // Multi-tag filters
    activeFilters.multiTags.forEach((tag, index) => {
        container.appendChild(createActiveFilterTag('Multi-Tag', tag, 'multiTag', index));
    });
    
    // Sort filter (only show if not default)
    if (activeFilters.sort !== 'upvotes-desc') {
        const sortLabel = sortBy.options[sortBy.selectedIndex].text;
        container.appendChild(createActiveFilterTag('Sort', sortLabel, 'sort'));
    }
}

// Create active filter tag element
function createActiveFilterTag(type, value, filterType, index = null) {
    const tag = document.createElement('div');
    tag.className = 'active-filter';
    tag.innerHTML = `
        <span>${type}: ${escapeHtml(value)}</span>
        <button class="remove-filter" onclick="removeActiveFilter('${filterType}', ${index})" title="Remove filter">
            <i class="fas fa-times"></i>
        </button>
    `;
    return tag;
}

// Remove active filter
function removeActiveFilter(filterType, index = null) {
    switch (filterType) {
        case 'search':
            searchInput.value = '';
            clearSearch();
            break;
        case 'singleTag':
            tagFilter.value = '';
            handleTagFilter();
            break;
        case 'multiTag':
            const currentTags = multiTagSearch.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            currentTags.splice(index, 1);
            multiTagSearch.value = currentTags.join(', ');
            if (currentTags.length > 0) {
                multiTagSearch.value += ', ';
            }
            handleMultiTagSearch();
            break;
        case 'sort':
            sortBy.value = 'upvotes-desc';
            handleSort();
            break;
    }
}

// Populate tag filter dropdown and store all tags
function populateTagFilter() {
    const allTagsSet = new Set();
    
    allProducts.forEach(product => {
        product.tags.forEach(tag => {
            if (tag.trim()) {
                allTagsSet.add(tag.trim());
            }
        });
    });
    
    allTags = Array.from(allTagsSet).sort();
    
    // Clear existing options except "All Tags"
    tagFilter.innerHTML = '<option value="">All Tags</option>';
    
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function hideLoading() {
    loading.style.display = 'none';
}

function showNoResults() {
    noResults.style.display = 'block';
    document.querySelector('.table-container').style.display = 'none';
}

function hideNoResults() {
    noResults.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
}

function showError(message) {
    hideLoading();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: rgba(255, 255, 255, 0.95); border-radius: 16px; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6154; margin-bottom: 20px;"></i>
            <h3 style="color: #666; margin-bottom: 10px;">Error Loading Data</h3>
            <p style="color: #999;">${message}</p>
        </div>
    `;
    document.querySelector('.container').appendChild(errorDiv);
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .table-row-fade-in {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
