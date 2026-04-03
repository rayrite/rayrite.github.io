/**
 * AWS Exam Comparison Tables Module
 * Handles rendering, filtering, and interaction with comparison tables
 */

const ComparisonTables = (function() {
    'use strict';
    console.log('[ComparisonTables] Script loaded v2');

    // Private state
    let tablesData = null;
    let filteredTables = [];
    let activeFilters = {
        categories: [],
        exams: [],
        priorities: []
    };

    // Category color mapping
    const categoryColors = {
        'storage': '#005f73',
        'security': '#ae2012',
        'compute': '#0a9396',
        'database': '#9b2226',
        'support': '#5a8c7a',
        'infrastructure': '#ee9b00',
        'ai-ml': '#5c2751',
        'networking': '#ca6702',
        'pricing': '#bb3e03',
        'integration': '#3c1642',
        'ml-genai': '#9b5de5'
    };

    // Exam badge classes
    const examClasses = {
        'CLF-C02': 'clf-c02',
        'SAA-C03': 'saa-c03',
        'AIF-C01': 'aif-c01'
    };

    // Initialization state
    let initialized = false;
    let initPromise = null;

    /**
     * Initialize the comparison tables module
     */
    async function init() {
        if (initialized) return;
        if (initPromise) return initPromise;
        
        initPromise = (async () => {
            try {
                await loadData();
                renderSidebar();
                renderTables();
                setupEventListeners();
                updateStats();
                initialized = true;
            } catch (error) {
                initPromise = null;
                console.error('Failed to initialize comparison tables:', error);
                showError('Failed to load comparison tables. Please try again.');
            }
        })();
        return initPromise;
    }

    /**
     * Load comparison table data from JSON, trying multiple paths
     */
    async function loadData() {
        const paths = [
            '../data/comparison-tables.json',
            'data/comparison-tables.json',
            './data/comparison-tables.json',
            '../../data/comparison-tables.json'
        ];
        let lastError;
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    tablesData = await response.json();
                    filteredTables = [...tablesData.tables];
                    console.log('[ComparisonTables] Loaded from:', path);
                    return;
                }
            } catch (e) {
                lastError = e;
            }
        }
        console.error('Failed to load comparison-tables.json from any path:', paths);
        throw lastError || new Error('Could not load comparison-tables.json');
    }

    /**
     * Render the sidebar with filters
     */
    function renderSidebar() {
        const sidebar = document.getElementById('comparison-sidebar');
        if (!sidebar || !tablesData) return;

        const categories = tablesData.metadata.categories;
        const exams = ['CLF-C02', 'SAA-C03', 'AIF-C01'];
        const priorities = ['critical', 'high', 'medium'];

        // Count tables per category
        const categoryCounts = {};
        categories.forEach(cat => {
            categoryCounts[cat.id] = tablesData.tables.filter(t => t.category === cat.id).length;
        });

        // Count tables per exam
        const examCounts = {};
        exams.forEach(exam => {
            examCounts[exam] = tablesData.tables.filter(t => t.exams.includes(exam)).length;
        });

        // Count tables per priority
        const priorityCounts = {};
        priorities.forEach(priority => {
            priorityCounts[priority] = tablesData.tables.filter(t => t.priority === priority).length;
        });

        sidebar.innerHTML = `
            <div class="sidebar-section">
                <div class="sidebar-title">Categories</div>
                ${categories.map(cat => `
                    <div class="filter-option" data-filter="category" data-value="${cat.id}">
                        <input type="checkbox" id="cat-${cat.id}" value="${cat.id}">
                        <label for="cat-${cat.id}">${cat.name}</label>
                        <span class="filter-count">${categoryCounts[cat.id] || 0}</span>
                    </div>
                `).join('')}
            </div>

            <div class="sidebar-section">
                <div class="sidebar-title">Exams</div>
                ${exams.map(exam => `
                    <div class="filter-option" data-filter="exam" data-value="${exam}">
                        <input type="checkbox" id="exam-${exam}" value="${exam}">
                        <label for="exam-${exam}">${exam}</label>
                        <span class="filter-count">${examCounts[exam] || 0}</span>
                    </div>
                `).join('')}
            </div>

            <div class="sidebar-section">
                <div class="sidebar-title">Priority</div>
                ${priorities.map(priority => `
                    <div class="filter-option" data-filter="priority" data-value="${priority}">
                        <input type="checkbox" id="priority-${priority}" value="${priority}">
                        <label for="priority-${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</label>
                        <span class="filter-count">${priorityCounts[priority] || 0}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render the comparison table grid
     */
    function renderTables() {
        const grid = document.getElementById('comparison-grid');
        if (!grid) return;

        if (filteredTables.length === 0) {
            grid.innerHTML = `
                <div class="comparison-empty" style="grid-column: 1 / -1;">
                    <div class="comparison-empty-icon">📊</div>
                    <h3>No tables match your filters</h3>
                    <p>Try adjusting your filter criteria to see more comparison tables.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredTables.map(table => createTableCard(table)).join('');
    }

    /**
     * Create HTML for a single comparison table card
     */
    function createTableCard(table) {
        const categoryColor = categoryColors[table.category] || '#666';
        const priorityBadge = table.priority === 'critical' ? 
            '<span class="badge priority-critical">Critical</span>' : '';

        return `
            <div class="comparison-card" data-table-id="${table.id}">
                <div class="comparison-card-header bg-category-${table.category}">
                    <h3>${escapeHtml(table.title)}</h3>
                    <div class="comparison-card-badges">
                        ${priorityBadge}
                    </div>
                </div>
                
                <div class="comparison-context">
                    ${escapeHtml(table.context)}
                </div>

                <div class="comparison-table-wrapper">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                ${table.columns.map(col => `<th>${escapeHtml(col.header)}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${table.rows.map(row => createTableRow(row, table.columns)).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="comparison-card-footer">
                    <div class="exam-tags">
                        ${table.exams.map(exam => `
                            <span class="exam-tag ${examClasses[exam] || ''}">${exam}</span>
                        `).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="btn-sm btn-outline" onclick="ComparisonTables.showDetail('${table.id}')">
                            Details
                        </button>
                        <button class="btn-sm btn-primary" onclick="ComparisonTables.addToStudyList('${table.id}')">
                            + Study
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create HTML for a table row
     */
    function createTableRow(row, columns) {
        return `
            <tr>
                <td><strong>${escapeHtml(row.feature)}</strong></td>
                ${columns.slice(1).map(col => {
                    const cell = row.cells[col.id];
                    if (!cell) return '<td>-</td>';
                    
                    const highlightClass = cell.highlight ? 'highlight' : '';
                    const title = cell.highlightReason ? escapeHtml(cell.highlightReason) : '';
                    const value = renderMarkdown(cell.value);
                    
                    return `<td class="${highlightClass}" title="${title}">${value}</td>`;
                }).join('')}
            </tr>
        `;
    }

    /**
     * Simple markdown renderer for cell content
     */
    function renderMarkdown(text) {
        if (!text) return '';
        
        // Bold: **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic: *text*
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return text;
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Setup event listeners for filters
     */
    function setupEventListeners() {
        const sidebar = document.getElementById('comparison-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                updateFilters();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    /**
     * Update filters based on current checkbox state
     */
    function updateFilters() {
        activeFilters.categories = Array.from(
            document.querySelectorAll('#comparison-sidebar [data-filter="category"] input:checked')
        ).map(cb => cb.value);

        activeFilters.exams = Array.from(
            document.querySelectorAll('#comparison-sidebar [data-filter="exam"] input:checked')
        ).map(cb => cb.value);

        activeFilters.priorities = Array.from(
            document.querySelectorAll('#comparison-sidebar [data-filter="priority"] input:checked')
        ).map(cb => cb.value);

        applyFilters();
    }

    /**
     * Apply current filters to the table list
     */
    function applyFilters() {
        filteredTables = tablesData.tables.filter(table => {
            // Category filter
            if (activeFilters.categories.length > 0) {
                if (!activeFilters.categories.includes(table.category)) {
                    return false;
                }
            }

            // Exam filter
            if (activeFilters.exams.length > 0) {
                if (!table.exams.some(exam => activeFilters.exams.includes(exam))) {
                    return false;
                }
            }

            // Priority filter
            if (activeFilters.priorities.length > 0) {
                if (!activeFilters.priorities.includes(table.priority)) {
                    return false;
                }
            }

            return true;
        });

        renderTables();
        updateStats();
    }

    /**
     * Update statistics display
     */
    function updateStats() {
        const statsContainer = document.getElementById('comparison-stats');
        if (!statsContainer) return;

        const totalTables = tablesData.tables.length;
        const showingTables = filteredTables.length;

        statsContainer.innerHTML = `
            <div class="stats-left">
                Showing <strong>${showingTables}</strong> of <strong>${totalTables}</strong> tables
            </div>
            <div class="stats-right">
                <div class="stat-item">
                    <span class="stat-value">${tablesData.tables.filter(t => t.priority === 'critical').length}</span>
                    <span class="stat-label">Critical</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${tablesData.metadata.categories.length}</span>
                    <span class="stat-label">Categories</span>
                </div>
            </div>
        `;
    }

    /**
     * Show detail modal for a table
     */
    function showDetail(tableId) {
        const table = tablesData.tables.find(t => t.id === tableId);
        if (!table) return;

        const modal = document.getElementById('comparison-modal');
        const modalContent = document.getElementById('comparison-modal-content');

        modalContent.innerHTML = createModalContent(table);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Create HTML content for detail modal
     */
    function createModalContent(table) {
        const categoryColor = categoryColors[table.category] || '#666';

        return `
            <div class="comparison-modal-header bg-category-${table.category}">
                <h2>${escapeHtml(table.title)}</h2>
                <button class="comparison-modal-close" onclick="ComparisonTables.closeModal()">&times;</button>
            </div>
            
            <div class="comparison-modal-body">
                <div class="modal-section">
                    <div class="comparison-context" style="margin: 0; border-radius: 6px;">
                        ${escapeHtml(table.context)}
                    </div>
                </div>

                <div class="modal-section">
                    <div class="modal-section-title">Comparison Table</div>
                    <div class="comparison-table-wrapper" style="padding: 0;">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    ${table.columns.map(col => `<th>${escapeHtml(col.header)}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${table.rows.map(row => createTableRow(row, table.columns)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                ${table.mnemonic ? `
                    <div class="modal-section">
                        <div class="mnemonic-box">
                            <span class="mnemonic-label">Memory Aid</span>
                            ${escapeHtml(table.mnemonic)}
                        </div>
                    </div>
                ` : ''}

                ${table.examTips && table.examTips.length > 0 ? `
                    <div class="modal-section">
                        <div class="modal-section-title">Exam Tips</div>
                        <ul class="exam-tips-list">
                            ${table.examTips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="modal-section">
                    <div class="modal-section-title">Exam Relevance</div>
                    <div class="exam-relevance-box">
                        ${Object.entries(table.examRelevance || {}).map(([exam, relevance]) => `
                            <div class="exam-relevance-item">
                                <span class="exam-name">${exam}:</span> 
                                ${escapeHtml(relevance.domain)} (${relevance.weight})
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${table.relatedTerms && table.relatedTerms.length > 0 ? `
                    <div class="modal-section">
                        <div class="modal-section-title">Related Terms</div>
                        <div class="related-terms">
                            ${table.relatedTerms.map(term => `
                                <a href="#" class="related-term-tag" onclick="ComparisonTables.searchTerm('${escapeHtml(term)}'); return false;">
                                    ${escapeHtml(term)}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Close the detail modal
     */
    function closeModal() {
        const modal = document.getElementById('comparison-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Add table to study list (stored in localStorage)
     */
    function addToStudyList(tableId) {
        const table = tablesData.tables.find(t => t.id === tableId);
        if (!table) return;

        let studyList = JSON.parse(localStorage.getItem('awsComparisonStudyList') || '[]');
        
        if (!studyList.includes(tableId)) {
            studyList.push(tableId);
            localStorage.setItem('awsComparisonStudyList', JSON.stringify(studyList));
            showNotification(`"${table.title}" added to study list`);
        } else {
            showNotification('Already in study list', 'info');
        }
    }

    /**
     * Search for a term (integrates with main viewer search)
     */
    function searchTerm(term) {
        // Close modal
        closeModal();
        
        // Switch to card view if available
        if (window.App && window.App.switchToCardView) {
            window.App.switchToCardView();
            window.App.search(term);
        } else {
            // Fallback: show alert with term
            alert(`Search for: ${term}`);
        }
    }

    /**
     * Show notification toast
     */
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.comparison-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `comparison-notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            font-size: 13px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Show error message
     */
    function showError(message) {
        const grid = document.getElementById('comparison-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="comparison-empty" style="grid-column: 1 / -1;">
                    <div class="comparison-empty-icon">⚠️</div>
                    <h3>Error Loading Data</h3>
                    <p>${escapeHtml(message)}</p>
                </div>
            `;
        }
    }

    /**
     * Get current study list
     */
    function getStudyList() {
        return JSON.parse(localStorage.getItem('awsComparisonStudyList') || '[]');
    }

    /**
     * Clear all filters
     */
    function clearFilters() {
        document.querySelectorAll('#comparison-sidebar input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        activeFilters = { categories: [], exams: [], priorities: [] };
        applyFilters();
    }

    // Eagerly initialize - handle case where DOMContentLoaded already fired
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { init(); });
    } else {
        init();
    }

    // Public API
    return {
        init,
        showDetail,
        closeModal,
        addToStudyList,
        searchTerm,
        getStudyList,
        clearFilters,
        render() {
            if (tablesData) {
                renderTables();
                updateStats();
            }
        },
        get initialized() { return initialized; }
    };
})();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
