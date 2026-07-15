document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Class Toggle
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 2. Animation on Scroll (Simple Custom Intersection Observer)
    const animateElements = document.querySelectorAll('.scroll-animate');
    
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            el.style.opacity = '0'; // hide initially
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        animateElements.forEach(el => {
            el.style.opacity = '1';
        });
    }

    // 3. Counter Animation for Home Page Stats
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0 && 'IntersectionObserver' in window) {
        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const targetVal = parseInt(targetEl.getAttribute('data-count'), 10);
                    let currentVal = 0;
                    const duration = 2000; // 2 seconds
                    const increment = targetVal / (duration / 16); // ~60fps
                    
                    const updateCount = () => {
                        currentVal += increment;
                        if (currentVal >= targetVal) {
                            // Format number nicely
                            if (targetVal === 5000) {
                                targetEl.textContent = '5,000+';
                            } else if (targetVal === 24) {
                                targetEl.textContent = '24/7';
                            } else if (targetVal === 100) {
                                targetEl.textContent = '100%';
                            } else {
                                targetEl.textContent = targetVal + (targetEl.getAttribute('data-suffix') || '');
                            }
                            observer.unobserve(targetEl);
                        } else {
                            targetEl.textContent = Math.floor(currentVal) + (targetEl.getAttribute('data-suffix') || '');
                            requestAnimationFrame(updateCount);
                        }
                    };
                    updateCount();
                }
            });
        });
        stats.forEach(stat => statObserver.observe(stat));
    }

    // 4. Contact Form Validation and AJAX Formspree Submission
    const contactForm = document.getElementById('cardonContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check validation
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }
            
            // If valid, submit to Formspree via AJAX Fetch
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting Request...';
            
            const formData = new FormData(contactForm);
            
            fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.innerHTML = `
                        <div class="text-center py-5">
                            <div class="mb-4">
                                <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                            </div>
                            <h4 class="mb-3 text-navy fw-bold">Thank You!</h4>
                            <p class="text-muted">Your corporate request has been submitted successfully to Formspree. Our team will review your project details and get back to you shortly.</p>
                            <button class="btn btn-primary-custom mt-3" onclick="location.reload()">Send Another Message</button>
                        </div>
                    `;
                } else {
                    response.json().then(data => {
                        alert(data.error || 'Oops! There was a problem submitting your form.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    });
                }
            })
            .catch(error => {
                alert('Oops! There was a network error submitting your form.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    }

    // 5. Active Navbar Link Highlighter
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
