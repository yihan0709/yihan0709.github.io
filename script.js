/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "電子工程與數位系統設計",
        "C/C++ 程式設計與演算法",
        "數位邏輯與 FPGA 硬體實作",
        "Arduino 嵌入式開發"
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Small break before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typewriter if element exists
    if (typewriterElement) {
        setTimeout(type, 1000);
    }


    // --- 2. MOBILE MENU NAVIGATION TOGGLE ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
        
        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }


    // --- 3. SCROLL HEADER & NAVIGATION HIGHLIGHTING ---
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Transparent/Scrolled header state
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active section nav link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140; // Align with header height & padding
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });


    // --- 4. GRADE CIRCULAR PROGRESS RINGS ANIMATION ---
    const courseCards = document.querySelectorAll('.course-card');
    
    // Circumference of our circles is 2 * PI * R where R=50. C = 314.16.
    const CIRCUMFERENCE = 314.16;
    
    // Prepare initial state (empty rings)
    const circles = document.querySelectorAll('.progress-ring-circle');
    circles.forEach(circle => {
        circle.style.strokeDasharray = CIRCUMFERENCE;
        circle.style.strokeDashoffset = CIRCUMFERENCE;
    });
    
    function animateCourseGrades() {
        const progressContainers = document.querySelectorAll('.course-circle-progress');
        
        progressContainers.forEach(container => {
            const grade = parseInt(container.getAttribute('data-grade'), 10);
            const circle = container.querySelector('.progress-ring-circle');
            
            if (circle) {
                // Calculate dashoffset relative to the grade percentage
                const offset = CIRCUMFERENCE - (grade / 100) * CIRCUMFERENCE;
                circle.style.strokeDashoffset = offset;
            }
        });
    }
    
    // Trigger animations only when courses section comes into viewport
    const coursesSection = document.getElementById('courses');
    if (coursesSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCourseGrades();
                    obs.unobserve(entry.target); // Animate once
                }
            });
        }, { threshold: 0.15 });
        
        observer.observe(coursesSection);
    } else {
        // Fallback for older browsers
        setTimeout(animateCourseGrades, 1000);
    }


    // --- 5. CONTACT FORM INTERACTIVE SIMULATION ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status-message');
    const submitBtn = document.getElementById('btn-submit');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // UI Feedback during submission
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>傳送中...</span> <svg class="spinning" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`;
            
            // Add a style rule in JS for spinning if not already defined
            const spinStyle = document.createElement('style');
            spinStyle.innerHTML = `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .spinning { animation: spin 1s linear infinite; }
            `;
            document.head.appendChild(spinStyle);
            
            // Simulate API request delay
            setTimeout(() => {
                // Success output
                formStatus.className = 'success';
                formStatus.textContent = '感謝您的訊息！已成功模擬發送，我會盡快與您聯絡。';
                
                // Clear input fields
                contactForm.reset();
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Auto-fade message after 5 seconds
                setTimeout(() => {
                    formStatus.className = 'hidden';
                }, 5000);
            }, 1500);
        });
    }
});
