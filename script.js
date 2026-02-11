const testimonials = [
    {
        id: 1,
        name: "Abdul basit",
        role: "STR Manager & Guest Experience Specialist",
        content: "My new portfolio landed me three major clients within a month. The investment paid for itself 10x over.",
        rating: 5,
        result: "+300% client inquiries",
        image: "img/testimonial-1.jpeg",
    },
    {
        id: 2,
        name: "Zaniab",
        role: "Sales therapist",
        content: "The credibility boost was immediate. My consultation bookings tripled, and I could raise my rates by 40%.",
        rating: 5,
        result: "40% higher rates",
        image: "img/testimonial-2.webp",
    },
    {
        id: 3,
        name: "Alex Johnson",
        role: "UI/UX Designer",
        content: "From invisible to undeniable. Our website now converts visitors at 12% - something we never thought possible.",
        rating: 5,
        result: "12% conversion rate",
        image: "img/testimonial-3.jpeg",
    },
    {
        id: 4,
        name: "Richard Kolawole",
        role: "Executive Coach",
        content: "The professional presentation immediately established authority. I now attract Fortune 500 clients.",
        rating: 5,
        result: "Enterprise clients",
        image: "img/testimonial-4.jpeg",
    },
    {
        id: 5,
        name: "Peter Adedokun",
        role: "Tech Consultant",
        content: "Best business decision I made. The portfolio showcases my expertise better than any resume ever could.",
        rating: 5,
        result: "6-figure contract",
        image: "img/testimonial-5.jpeg",
    },
];
// ===== RENDER TESTIMONIAL CAROUSEL =====

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                formStatus.innerHTML = " Message sent successfully!";
                formStatus.style.color = "#00E9FF";

                submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent!';
                submitBtn.style.background = "#008C99";

                contactForm.reset();
            } else {
                formStatus.innerHTML = " Something went wrong.";
                formStatus.style.color = "red";
            }

        } catch (error) {
            formStatus.innerHTML = " Network error. Try again.";
            formStatus.style.color = "red";
        }

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
        }, 2000);
    });
}



function renderTestimonialCarousel() {
    const testimonialGrid = document.getElementById('testimonialGrid');
    if (!testimonialGrid) return;

    // Clear existing content
    testimonialGrid.innerHTML = '';

    // Set carousel mode class
    testimonialGrid.className = 'testimonial-grid carousel-mode';

    // Create testimonial cards
    testimonials.forEach((testimonial) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card hover-card';

        // Generate star rating HTML
        let starsHTML = '';
        for (let i = 0; i < testimonial.rating; i++) {
            starsHTML += '<i class="fa-solid fa-star"></i>';
        }

        card.innerHTML = `
            <div class="testimonial-header">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image" onerror="this.src='https://placehold.co/400x400/273142/00E9FF?text=${testimonial.name.charAt(0)}'">
                <div class="testimonial-author-info">
                    <h4>${testimonial.name}</h4>
                    <span class="role">${testimonial.role}</span>
                </div>
            </div>
            <span class="testimonial-result-badge"><i class="fa-solid fa-chart-line"></i> ${testimonial.result}</span>
            <p class="quote">"${testimonial.content}"</p>
            <div class="testimonial-stars">
                ${starsHTML}
            </div>
        `;

        testimonialGrid.appendChild(card);
    });

    // Initialize carousel dots
    updateCarouselDots();
}

// ===== CAROUSEL FUNCTIONALITY =====
let currentSlide = 0;
let autoPlayInterval = null;
const AUTOPLAY_DELAY = 5000; // 5 seconds

function updateCarouselDots() {
    const dotsContainer = document.getElementById('carouselDots');
    const controls = document.querySelector('.carousel-controls');

    if (!dotsContainer) return;

    // Show controls
    if (controls) controls.style.display = 'flex';

    // Clear existing dots
    dotsContainer.innerHTML = '';

    // Create dots for each testimonial
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === currentSlide ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = index;
            scrollToSlide(currentSlide);
            updateCarouselDots();
            startAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
}

let testimonialVisible = false;

const testimonialSection = document.getElementById('testimonialSection');

if (testimonialSection) {
    const observer = new IntersectionObserver((entries) => {
        testimonialVisible = entries[ 0 ].isIntersecting;

        if (testimonialVisible) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }, { threshold: 0.3 });

    observer.observe(testimonialSection);
}


function scrollToSlide(index) {
    const testimonialGrid = document.getElementById('testimonialGrid');
    if (!testimonialGrid) return;

    const cards = testimonialGrid.querySelectorAll('.testimonial-card');
    if (!cards[ index ]) return;

    testimonialGrid.scrollTo({
        left: cards[ index ].offsetLeft,
        behavior: 'smooth'
    });
}


// ===== CAROUSEL NAVIGATION =====
function initCarouselNavigation() {
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const testimonialGrid = document.getElementById('testimonialGrid');

    if (prevBtn && nextBtn && testimonialGrid) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            scrollToSlide(currentSlide);
            updateCarouselDots();
            startAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = (currentSlide + 1) % testimonials.length;
            scrollToSlide(currentSlide);
            updateCarouselDots();
            startAutoPlay();
        });

        // Update active dot on scroll with debounce
        let scrollTimeout;
        testimonialGrid.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (testimonialGrid.classList.contains('carousel-mode')) {
                    const cards = testimonialGrid.querySelectorAll('.testimonial-card');
                    const scrollPosition = testimonialGrid.scrollLeft;
                    const containerWidth = testimonialGrid.offsetWidth;

                    // Find which card is most visible
                    let maxVisibleArea = 0;
                    let mostVisibleIndex = currentSlide;

                    cards.forEach((card, index) => {
                        const cardStart = card.offsetLeft;
                        const cardWidth = card.offsetWidth;
                        const cardEnd = cardStart + cardWidth;

                        // Calculate how much of the card is visible
                        const visibleStart = Math.max(cardStart, testimonialGrid.scrollLeft);
                        const visibleEnd = Math.min(cardEnd, testimonialGrid.scrollLeft + containerWidth);
                        const visibleArea = Math.max(0, visibleEnd - visibleStart);

                        if (visibleArea > maxVisibleArea) {
                            maxVisibleArea = visibleArea;
                            mostVisibleIndex = index;
                        }
                    });

                    if (mostVisibleIndex !== currentSlide) {
                        currentSlide = mostVisibleIndex;
                        updateCarouselDots();
                    }
                }
            }, 100);
        });
    }
}

// ===== AUTOPLAY FUNCTIONALITY =====
function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    autoPlayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        scrollToSlide(currentSlide);
        updateCarouselDots();
    }, AUTOPLAY_DELAY);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// ===== TOUCH/SWIPE SUPPORT FOR MOBILE =====
function initSwipeSupport() {
    const testimonialGrid = document.getElementById('testimonialGrid');
    if (!testimonialGrid) return;

    let touchStartX = 0;
    let touchEndX = 0;

    testimonialGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[ 0 ].screenX;
        stopAutoPlay();
    }, { passive: true });

    testimonialGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[ 0 ].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentSlide = (currentSlide + 1) % testimonials.length;
            } else {
                // Swipe right - previous
                currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            }
            scrollToSlide(currentSlide);
            updateCarouselDots();
        }
    }
}

// ===== PAUSE AUTOPLAY ON HOVER =====
function initHoverPause() {
    const testimonialGrid = document.getElementById('testimonialGrid');
    if (!testimonialGrid) return;

    testimonialGrid.addEventListener('mouseenter', stopAutoPlay);
    testimonialGrid.addEventListener('mouseleave', startAutoPlay);
}

// ----- FADE-IN ON SCROLL (Intersection Observer) -----
const fadeElements = document.querySelectorAll('.fade-in-section');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ----- SINGLE CTA BUTTON BEHAVIOR -----
const ctaButtons = document.querySelectorAll(
    '.cta-main:not([type="submit"]), .btn-primary:not([type="submit"])'
);

function handleCTA(e) {
    e.preventDefault();

    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

            contactForm.style.transition = 'box-shadow 0.3s';
            contactForm.style.boxShadow = '0 0 0 4px rgba(0, 233, 255, 0.5)';
            setTimeout(() => {
                contactForm.style.boxShadow = '';
            }, 1000);
        }

        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }, 400);
}

ctaButtons.forEach(btn => {
    btn.addEventListener('click', handleCTA);
});


// ----- SOCIAL ICONS HOVER ANIMATION -----
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.querySelector('i').classList.add('fa-beat');
    });

    icon.addEventListener('mouseleave', function () {
        this.querySelector('i').classList.remove('fa-beat');
    });
});

// ----- STAT COUNTER ANIMATION -----
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target;
            const targetValue = statElement.innerText.replace('%', '').replace('x', '');

            if (!isNaN(targetValue) && !statElement.classList.contains('counted')) {
                statElement.classList.add('counted');

                let startValue = 0;
                let endValue = parseInt(targetValue);
                let duration = 1500;
                let increment = endValue / (duration / 16);

                let counter = setInterval(() => {
                    startValue += increment;
                    if (startValue >= endValue) {
                        statElement.innerText = statElement.innerText.includes('%') ?
                            endValue + '%' : statElement.innerText.includes('x') ?
                                endValue + 'x' : endValue;
                        clearInterval(counter);
                    } else {
                        statElement.innerText = statElement.innerText.includes('%') ?
                            Math.floor(startValue) + '%' : statElement.innerText.includes('x') ?
                                Math.floor(startValue) + 'x' : Math.floor(startValue);
                    }
                }, 20);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statObserver.observe(stat));

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function () {
    // Render testimonial carousel
    renderTestimonialCarousel();

    // Initialize carousel navigation
    initCarouselNavigation();

    // Initialize swipe support for mobile
    initSwipeSupport();

    // Initialize hover pause for autoplay
    initHoverPause();

    console.log('✅ Testimonial carousel initialized with 5 client stories! Auto-play enabled.');
});

// Clean up autoplay when page is hidden
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// ----- MOBILE TOUCH OPTIMIZATION -----
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');

    const hoverCards = document.querySelectorAll('.hover-card');
    hoverCards.forEach(card => {
        card.addEventListener('touchstart', function () {
            this.style.borderColor = '#00E9FF';
            this.style.background = '#23303e';
        });

        card.addEventListener('touchend', function () {
            setTimeout(() => {
                this.style.borderColor = '';
                this.style.background = '';
            }, 200);
        });
    });
}

// ----- FLOATING ICON ANIMATIONS (reduced frequency) -----
setInterval(() => {
    const randomIcon = document.querySelectorAll('.fa-solid, .fa-regular')[ Math.floor(Math.random() * 20) ];
    if (randomIcon) {
        randomIcon.classList.add('fa-shake');
        setTimeout(() => {
            randomIcon.classList.remove('fa-shake');
        }, 500);
    }
}, 4000);
