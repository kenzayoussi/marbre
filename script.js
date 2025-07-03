// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Social media icons cursor handling
    const socialLinks = document.querySelectorAll('.social-links a');
    console.log('Found social links:', socialLinks.length); // Debug log
    
    // Function to check if dev tools are open
    function isDevToolsOpen() {
        return window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    }
    
    socialLinks.forEach(link => {
        // Change cursor on hover
        link.addEventListener('mouseenter', function() {
            if (!isDevToolsOpen()) {
                document.body.style.cursor = 'crosshair';
            }
        });
        
        // Reset cursor when mouse leaves
        link.addEventListener('mouseleave', function() {
            if (!isDevToolsOpen()) {
                document.body.style.cursor = 'default';
            }
        });
        
        // Click event
        link.addEventListener('click', function(e) {
            if (!isDevToolsOpen()) {
                console.log('Icon clicked'); // Debug log
                document.body.style.cursor = 'crosshair';
                
                setTimeout(() => {
                    document.body.style.cursor = 'default';
                }, 200);
            }
        });
    });

    // Tab functionality
    const tabItems = document.querySelectorAll('.tab-item');

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            tabItems.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
        });
    });

    // Navbar scroll functionality
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    const scrollThreshold = 50; // Minimum scroll amount before hiding

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Handle dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 799) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Get slider elements
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Initialize variables
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Move slider
    function moveSlider() {
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        updateDots();
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        moveSlider();
    }

    // Update dots
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    // Next/Prev slide
    function nextSlide() {
        if (totalSlides > 0) {
            currentSlide = (currentSlide + 1) % totalSlides;
            moveSlider();
        }
    }
    function prevSlide() {
        if (totalSlides > 0) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            moveSlider();
        }
    }

    // Arrow event listeners
    if (leftArrow) leftArrow.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    if (rightArrow) rightArrow.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    if (totalSlides > 1) {
        startAutoSlide();
    }

    // Initialize dots
    createDots();
    moveSlider();

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax hero effect
    const parallaxHero = document.querySelector('.parallax-hero');
    const heroContent = parallaxHero ? parallaxHero.querySelector('.hero-content') : null;

    if (parallaxHero && heroContent) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            heroContent.style.transform = `translate3d(0, ${rate}px, 0)`;
        });

        // Parallax effect with improved performance
        let ticking = false;
        let lastScrollY = window.scrollY;
        let currentTranslate = 0;

        function updateParallax() {
            const scrolled = window.scrollY;
            const delta = scrolled - lastScrollY;
            lastScrollY = scrolled;

            // Calculate new position with smooth acceleration/deceleration
            currentTranslate += delta * 0.3;
            
            // Apply smooth easing
            const targetTranslate = currentTranslate * 0.95;
            currentTranslate = targetTranslate;

            // Apply the transform with hardware acceleration
            heroContent.style.transform = `translate3d(0, ${currentTranslate}px, 0)`;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Reset position when scrolling to top
        window.addEventListener('scroll', function() {
            if (window.scrollY === 0) {
                currentTranslate = 0;
                heroContent.style.transform = 'translate3d(0, 0, 0)';
            }
        });
    }

    // Make all product cards visible immediately
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('visible');
    });

    // Mobile menu functionality
    const mobileMenu = document.getElementById('mobile');
    const navbar = document.getElementById('navbar');
    const bar = document.getElementById('bar');

    if (bar && navbar) {
        bar.addEventListener('click', function() {
            navbar.classList.toggle('active');
            if (navbar.classList.contains('active')) {
                bar.classList.remove('fa-bars');
                bar.classList.add('fa-times');
            } else {
                bar.classList.add('fa-bars');
                bar.classList.remove('fa-times');
            }
        });
    }

    function resetMenuIcon() {
        if (navbar && !navbar.classList.contains('active')) {
            bar.classList.add('fa-bars');
            bar.classList.remove('fa-times');
            console.log('Menu forcibly closed, icon is fa-bars');
        }
    }

    document.addEventListener('click', (e) => {
        if (navbar && navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            navbar.classList.remove('active');
            resetMenuIcon();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 799 && navbar && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            resetMenuIcon();
        }
    });

    // Contact form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, message })
                });
                const result = await response.json();
                if (result.success) {
                    alert('Votre message a été envoyé avec succès !');
                    contactForm.reset();
                } else {
                    alert('Erreur lors de l\'envoi du message : ' + (result.error || 'Veuillez réessayer.'));
                }
            } catch (err) {
                alert('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
            }
        });
    }

    // Force mobile navbar size
    function forceMobileNavbarSize() {
        var navbar = document.getElementById('navbar');
        if (navbar && window.innerWidth <= 600) {
            navbar.style.width = '80px';
            navbar.style.fontSize = '10px';
            navbar.style.padding = '0';
        }
    }
    window.addEventListener('resize', forceMobileNavbarSize);
    window.addEventListener('DOMContentLoaded', forceMobileNavbarSize);
}); 
