
class BlueskyReviewsBrowser {
    constructor() {
        this.allReviews = [];
        this.filteredReviews = [];
        this.currentPage = 1;
        this.reviewsPerPage = 10;
        this.init();
    }

    async init() {
        try {
            await this.loadReviews();
            this.setupEventListeners();
            this.updateStats();
            this.applyFiltersAndSort();
        } catch (error) {
            this.showError(error);
        }
    }

    async loadReviews() {
        try {
            const response = await fetch('./bluesky_reviews_raw.json');
            if (!response.ok) {
                throw new Error('Failed to load reviews data');
            }
            this.allReviews = await response.json();
            
            // Process dates for better filtering
            this.allReviews.forEach(review => {
                review.parsedDate = new Date(review.review_date);
            });
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('reviewsContainer').style.display = 'block';
            document.getElementById('pagination').style.display = 'flex';
        } catch (error) {
            throw new Error('Could not load reviews: ' + error.message);
        }
    }

    setupEventListeners() {
        // Search input
        document.getElementById('searchInput').addEventListener('input', 
            this.debounce(() => this.applyFiltersAndSort(), 300)
        );

        // Rating checkboxes
        document.querySelectorAll('.rating-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFiltersAndSort());
        });

        // Sort selection
        document.getElementById('sortBy').addEventListener('change', 
            () => this.applyFiltersAndSort()
        );

        // Date filters
        document.getElementById('dateFrom').addEventListener('change', 
            () => this.applyFiltersAndSort()
        );
        document.getElementById('dateTo').addEventListener('change', 
            () => this.applyFiltersAndSort()
        );

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', 
            () => this.clearAllFilters()
        );

        // Pagination
        document.getElementById('prevPage').addEventListener('click', 
            () => this.changePage(-1)
        );
        document.getElementById('nextPage').addEventListener('click', 
            () => this.changePage(1)
        );
    }

    debounce(func, wait) {
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

    applyFiltersAndSort() {
        let filtered = [...this.allReviews];

        // Apply search filter
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(review => 
                review.review_text?.toLowerCase().includes(searchTerm) ||
                review.reviewer_name?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply rating filter (multiple checkboxes)
        const selectedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked'))
            .map(checkbox => parseInt(checkbox.value));
        
        if (selectedRatings.length > 0 && selectedRatings.length < 5) {
            filtered = filtered.filter(review => 
                selectedRatings.includes(review.star_rating)
            );
        }

        // Apply date range filter
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter(review => 
                review.parsedDate >= fromDate
            );
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // Include full day
            filtered = filtered.filter(review => 
                review.parsedDate <= toDate
            );
        }

        // Apply sorting
        const sortBy = document.getElementById('sortBy').value;
        this.sortReviews(filtered, sortBy);

        this.filteredReviews = filtered;
        this.currentPage = 1;
        this.updateDisplay();
        this.updateStats();
    }

    sortReviews(reviews, sortBy) {
        switch (sortBy) {
            case 'date-desc':
                reviews.sort((a, b) => b.parsedDate - a.parsedDate);
                break;
            case 'date-asc':
                reviews.sort((a, b) => a.parsedDate - b.parsedDate);
                break;
            case 'rating-desc':
                reviews.sort((a, b) => b.star_rating - a.star_rating);
                break;
            case 'rating-asc':
                reviews.sort((a, b) => a.star_rating - b.star_rating);
                break;
            case 'thumbs-desc':
                reviews.sort((a, b) => (b.thumbs_up_count || 0) - (a.thumbs_up_count || 0));
                break;
        }
    }

    updateDisplay() {
        const container = document.getElementById('reviewsContainer');
        const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
        const endIndex = startIndex + this.reviewsPerPage;
        const reviewsToShow = this.filteredReviews.slice(startIndex, endIndex);

        if (reviewsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <h3>😔 No Reviews Found</h3>
                    <p>Try adjusting your filters to see more reviews.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = reviewsToShow.map(review => this.createReviewCard(review)).join('');
        this.updatePagination();
    }

    createReviewCard(review) {
        const stars = this.createStarRating(review.star_rating);
        const formattedDate = this.formatDate(review.review_date);
        const developerResponse = review.developer_response ? 
            this.createDeveloperResponse(review) : '';
        
        const thumbsUpText = review.thumbs_up_count > 0 ? 
            `👍 ${review.thumbs_up_count}` : '';

        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${this.escapeHtml(review.reviewer_name || 'Anonymous')}</div>
                        <div class="review-date">📅 ${formattedDate}</div>
                    </div>
                    <div class="rating-info">
                        <div class="star-rating">${stars}</div>
                        ${thumbsUpText ? `<div class="thumbs-up">${thumbsUpText}</div>` : ''}
                    </div>
                </div>
                <div class="review-text">${this.escapeHtml(review.review_text || 'No review text')}</div>
                <div class="review-meta">
                    ${review.app_version ? `<div class="meta-item">📱 App Version: ${review.app_version}</div>` : ''}
                    ${review.review_created_version ? `<div class="meta-item">🔧 Created on Version: ${review.review_created_version}</div>` : ''}
                </div>
                ${developerResponse}
            </div>
        `;
    }

    createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= rating ? 'filled' : 'empty'}">${i <= rating ? '★' : '☆'}</span>`;
        }
        return stars;
    }

    createDeveloperResponse(review) {
        const responseDate = review.developer_response_date ? 
            this.formatDate(review.developer_response_date) : 'Unknown date';
        
        return `
            <div class="developer-response">
                <div class="response-header">👨‍💻 Developer Response</div>
                <div class="response-text">${this.escapeHtml(review.developer_response)}</div>
                <div class="response-date">📅 ${responseDate}</div>
            </div>
        `;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const totalReviews = this.allReviews.length;
        const showingCount = this.filteredReviews.length;
        
        const avgRating = this.allReviews.length > 0 ? 
            (this.allReviews.reduce((sum, review) => sum + (review.star_rating || 0), 0) / totalReviews).toFixed(1) : 
            '0.0';

        document.getElementById('totalReviews').textContent = totalReviews.toLocaleString();
        document.getElementById('avgRating').textContent = `${avgRating} ⭐`;
        document.getElementById('showingCount').textContent = showingCount.toLocaleString();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.updateDisplay();
            
            // Scroll to top of reviews
            document.getElementById('reviewsContainer').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    clearAllFilters() {
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.rating-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });
        document.getElementById('sortBy').value = 'date-desc';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        
        this.applyFiltersAndSort();
    }

    showError(error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('reviewsContainer').style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
        console.error('Error loading reviews:', error);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlueskyReviewsBrowser();
});

// Add some additional CSS for no-reviews state
const additionalStyles = `
    .no-reviews {
        text-align: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        color: #4a5568;
    }
    
    .no-reviews h3 {
        font-size: 1.5em;
        margin-bottom: 15px;
        color: #2d3748;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
