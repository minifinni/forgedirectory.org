/**
 * ForgeAPI.io - Main JavaScript
 * Click tracking, filtering, search, and interactivity
 */

// ========================================
// UTM Parameter Builder
// ========================================

/**
 * Add UTM parameters to a URL for tracking
 * @param {string} url - The original URL
 * @param {string} manufacturer - The manufacturer name
 * @param {string} action - The action type (view_docs or get_api_key)
 * @returns {string} URL with UTM parameters
 */
function addUtmParams(url, manufacturer, action) {
    if (!url || url === '#') return '#';
    
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('utm_source', 'forgeapi');
        urlObj.searchParams.set('utm_medium', 'directory');
        urlObj.searchParams.set('utm_campaign', 'api-click');
        urlObj.searchParams.set('utm_content', `${manufacturer.toLowerCase()}-${action}`);
        return urlObj.toString();
    } catch (e) {
        // If URL is invalid, return original
        return url;
    }
}

// ========================================
// Click Tracking
// ========================================

const STORAGE_KEY = 'forgeapi_clicks';
const MANUFACTURER_CLICKS_KEY = 'forgeapi_manufacturer_clicks';

/**
 * Track a click and open the URL
 * @param {string} manufacturer - The manufacturer name
 * @param {string} action - The action type (view_docs or get_api_key)
 * @param {string} url - The URL to open
 */
function trackAndOpen(manufacturer, action, url) {
    // Don't track if URL is just a placeholder
    if (url === '#' || !url) {
        showToast('Link coming soon!');
        return;
    }

    // Add UTM parameters
    const trackedUrl = addUtmParams(url, manufacturer, action);
    
    // Log to localStorage with full history
    const clicks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    clicks.push({
        manufacturer,
        action,
        url: trackedUrl,
        timestamp: Date.now(),
        date: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clicks));
    
    // Track aggregate counts per manufacturer
    const manufacturerClicks = JSON.parse(localStorage.getItem(MANUFACTURER_CLICKS_KEY) || '{}');
    if (!manufacturerClicks[manufacturer]) {
        manufacturerClicks[manufacturer] = { count: 0, actions: {} };
    }
    manufacturerClicks[manufacturer].count++;
    manufacturerClicks[manufacturer].actions[action] = (manufacturerClicks[manufacturer].actions[action] || 0) + 1;
    localStorage.setItem(MANUFACTURER_CLICKS_KEY, JSON.stringify(manufacturerClicks));
    
    // Fire to Plausible if available
    if (window.plausible) {
        window.plausible('API Click', { 
            props: { 
                manufacturer, 
                action,
                url: url.substring(0, 100) // Truncate for privacy
            } 
        });
    }
    
    // Open in new tab
    window.open(trackedUrl, '_blank');
    
    // Update popular badges if on index page
    updatePopularBadges();
}

/**
 * Get top 3 most clicked manufacturers
 * @returns {Array} Array of [manufacturerName, clickCount] sorted by clicks
 */
function getTopManufacturers() {
    const manufacturerClicks = JSON.parse(localStorage.getItem(MANUFACTURER_CLICKS_KEY) || '{}');
    const sorted = Object.entries(manufacturerClicks)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3);
    return sorted;
}

/**
 * Update popular badges on cards based on click data
 */
function updatePopularBadges() {
    const topManufacturers = getTopManufacturers();
    const minClicksForPopular = 1; // Show after just 1 click during testing
    
    // Remove existing popular badges
    document.querySelectorAll('.popular-badge').forEach(el => el.remove());
    document.querySelectorAll('.manufacturer-card').forEach(card => {
        card.classList.remove('popular');
    });
    
    // Add badges to top manufacturers
    topManufacturers.forEach(([manufacturer, data], index) => {
        if (data.count >= minClicksForPopular) {
            const card = document.querySelector(`.manufacturer-card[data-name="${manufacturer}"]`);
            if (card) {
                card.classList.add('popular');
                const badge = document.createElement('div');
                badge.className = 'popular-badge';
                const rank = index === 0 ? '🔥 #1' : index === 1 ? '#2' : '#3';
                badge.innerHTML = `${rank} Popular`;
                card.appendChild(badge);
            }
        }
    });
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ========================================
// Category Filtering
// ========================================

let currentFilter = 'all';
let currentRegion = 'all';
let currentSearch = '';

function initFilters() {
    const filterPills = document.querySelectorAll('#filterBar .filter-pill');
    const regionPills = document.querySelectorAll('#regionBar .filter-pill');
    const searchInput = document.getElementById('searchInput');

    // Type filter pills
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.filter;
            applyFilters();
        });
    });

    // Region filter pills
    regionPills.forEach(pill => {
        pill.addEventListener('click', () => {
            regionPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentRegion = pill.dataset.region;
            applyFilters();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // Initialize popular badges
    updatePopularBadges();
}

function applyFilters() {
    const cards = document.querySelectorAll('.manufacturer-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const categories = card.dataset.categories || '';
        const region = card.dataset.region || 'global';
        const name = card.dataset.name || '';
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';

        // Check type filter
        const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);

        // Check region filter — global APIs match any region
        const matchesRegion = currentRegion === 'all' || region === currentRegion || region === 'global';
        
        // Check search filter
        const matchesSearch = !currentSearch || 
            name.includes(currentSearch) || 
            title.includes(currentSearch) || 
            description.includes(currentSearch);
        
        // Show/hide card
        if (matchesCategory && matchesRegion && matchesSearch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        if (visibleCount === cards.length) {
            resultsCount.textContent = `Showing all ${cards.length} manufacturers`;
        } else if (visibleCount === 0) {
            resultsCount.textContent = 'No manufacturers found';
        } else {
            resultsCount.textContent = `Showing ${visibleCount} of ${cards.length} manufacturers`;
        }
    }
    
    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function resetFilters() {
    currentFilter = 'all';
    currentSearch = '';
    
    // Reset UI
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.filter === 'all');
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    applyFilters();
}

function filterBy(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.filter === category);
    });
    applyFilters();
}

// ========================================
// Form Handling
// ========================================

function initForms() {
    // Newsletter form
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            showToast(`Thanks! We'll notify ${email} about new APIs.`);
            form.reset();
        });
    });
    
    // Submit manufacturer form
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(submitForm);
            const email = formData.get('email');
            
            // Show success state
            const successState = document.getElementById('successState');
            const submittedEmail = document.getElementById('submittedEmail');
            
            if (successState && submittedEmail) {
                submittedEmail.textContent = email;
                submitForm.style.display = 'none';
                successState.style.display = 'block';
                
                // Track submission
                const submissions = JSON.parse(localStorage.getItem('forgeapi_submissions') || '[]');
                submissions.push({
                    companyName: formData.get('companyName'),
                    timestamp: Date.now(),
                    date: new Date().toISOString()
                });
                localStorage.setItem('forgeapi_submissions', JSON.stringify(submissions));
            }
        });
    }
}

function resetForm() {
    const submitForm = document.getElementById('submitForm');
    const successState = document.getElementById('successState');
    
    if (submitForm && successState) {
        submitForm.reset();
        submitForm.style.display = 'block';
        successState.style.display = 'none';
    }
}

// ========================================
// Code Copy Functionality
// ========================================

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    
    if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.borderColor = 'var(--accent)';
            button.style.color = 'var(--accent)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.borderColor = '';
                button.style.color = '';
            }, 2000);
        }).catch(() => {
            showToast('Failed to copy code');
        });
    }
}

// ========================================
// Analytics Debug (Development)
// ========================================

function getAnalyticsData() {
    const clicks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const manufacturerClicks = JSON.parse(localStorage.getItem(MANUFACTURER_CLICKS_KEY) || '{}');
    
    return {
        totalClicks: clicks.length,
        topManufacturers: getTopManufacturers(),
        recentClicks: clicks.slice(-10),
        allManufacturerData: manufacturerClicks
    };
}

// Expose to console for debugging
window.forgeapi = {
    getAnalyticsData,
    trackAndOpen,
    getTopManufacturers,
    clearData: () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MANUFACTURER_CLICKS_KEY);
        showToast('Analytics data cleared');
        updatePopularBadges();
    }
};

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initForms();
    
    // Log analytics availability in console
    console.log('🔥 ForgeAPI.io loaded');
    console.log('Analytics available via window.forgeapi');
    console.log('Run forgeapi.getAnalyticsData() to see click data');
});
