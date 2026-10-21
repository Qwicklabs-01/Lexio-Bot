// Resilience Engineering
document.body.classList.add('js-enabled');

// Theme Toggle Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add a temporary transition class to prevent flickering if needed
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (!icon) return;
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.tool-card, .category-title, .tool-header');
    if (sections.length === 0 || !document.body.classList.contains('js-enabled')) return;

    sections.forEach(el => {
        revealObserver.observe(el);
    });
}

// Search Filtering
function initSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    // Add "no results" element if it doesn't exist
    let noResults = document.getElementById('noResults');
    if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResults';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '4rem';
        noResults.style.display = 'none';
        noResults.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
            <h3>No tools found</h3>
            <p style="color: var(--text-muted)">Try searching for something else like "PDF" or "AI"</p>
        `;
        const target = document.querySelector('.tools-section') || document.querySelector('main');
        if (target) target.appendChild(noResults);
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.tool-card');
        const categories = document.querySelectorAll('.category-title');
        let totalVisible = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(term) || desc.includes(term)) {
                card.style.display = 'flex';
                totalVisible++;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide/Show categories based on visible children
        categories.forEach(cat => {
            const nextGrid = cat.nextElementSibling;
            if (nextGrid && nextGrid.classList.contains('tool-grid')) {
                const visibleInSection = Array.from(nextGrid.children).filter(c => c.style.display !== 'none').length;
                cat.style.display = visibleInSection > 0 ? 'flex' : 'none';
            }
        });

        noResults.style.display = totalVisible === 0 ? 'block' : 'none';
    });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollEffects();
    initSearch();
    initBackToTop();
    initDropdown();
    initMobileMenu();
});

function initDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.onclick = (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) other.classList.remove('active');
                    });
                }
            };
        }
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
}


function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.onclick = () => {
        nav.classList.toggle('active');
        toggle.querySelector('i').className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    };

    const links = document.querySelectorAll('.nav-link, .dropdown-item');
    links.forEach(l => {
        l.onclick = () => {
            nav.classList.remove('active');
            toggle.querySelector('i').className = 'fas fa-bars';
        };
    });
}
