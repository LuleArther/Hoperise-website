// HopeRise website script
console.log("HopeRise website script loaded");

var SLIDER_MIN_INTERVAL = 2000;
var SLIDER_DEFAULT_INTERVAL = 6000;
var SLIDER_FADE_DURATION = 600;
var sliderIntervals = [];
var carouselIntervals = [];

// ─── Mobile navigation toggle ────────────────────────────────
function toggleMobileNav() {
    var nav = document.getElementById('mobile-nav');
    var icon = document.getElementById('mobile-nav-icon');
    if (!nav) return;
    var isOpen = nav.classList.toggle('open');
    if (icon) icon.textContent = isOpen ? 'close' : 'menu';
}

// ─── Background/image sliders ────────────────────────────────
function initImageSliders() {
    var sliders = document.querySelectorAll('[data-image-slider]');
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
        var data = slider.getAttribute('data-image-slider') || '';
        var images = data.split('|').map(function (src) { return src.trim(); }).filter(Boolean);
        if (!images.length) return;

        var index = 0;
        slider.style.backgroundImage = "url('" + images[index] + "')";

        if (images.length === 1) return;

        var intervalAttr = parseInt(slider.getAttribute('data-image-interval'), 10);
        var interval = Number.isFinite(intervalAttr) && intervalAttr >= SLIDER_MIN_INTERVAL
            ? intervalAttr
            : SLIDER_DEFAULT_INTERVAL;

        var intervalId = setInterval(function () {
            index = (index + 1) % images.length;
            slider.classList.add('is-fading');
            setTimeout(function () {
                slider.style.backgroundImage = "url('" + images[index] + "')";
                slider.classList.remove('is-fading');
            }, SLIDER_FADE_DURATION);
        }, interval);
        sliderIntervals.push(intervalId);
    });
}

function initProgramCarousels() {
    var carousels = document.querySelectorAll('[data-program-carousel]');
    if (!carousels.length) return;

    carousels.forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.program-carousel-slide'));
        if (!slides.length) return;

        var prevBtn = carousel.querySelector('[data-carousel-prev]');
        var nextBtn = carousel.querySelector('[data-carousel-next]');
        var dotsWrap = carousel.querySelector('[data-carousel-dots]');
        var activeIndex = 0;
        var autoplayDelay = parseInt(carousel.getAttribute('data-autoplay'), 10);
        if (!Number.isFinite(autoplayDelay) || autoplayDelay < SLIDER_MIN_INTERVAL) autoplayDelay = 7000;
        var touchStartX = 0;
        var touchEndX = 0;

        var dots = [];
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            slides.forEach(function (_, index) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot' + (index === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
                dot.addEventListener('click', function () {
                    goTo(index);
                    restartAutoplay();
                });
                dotsWrap.appendChild(dot);
                dots.push(dot);
            });
        }

        function updateUI() {
            slides.forEach(function (slide, index) {
                slide.classList.toggle('is-active', index === activeIndex);
            });
            dots.forEach(function (dot, index) {
                dot.classList.toggle('is-active', index === activeIndex);
            });
        }

        function goTo(index) {
            var count = slides.length;
            activeIndex = (index + count) % count;
            updateUI();
        }

        function next() { goTo(activeIndex + 1); }
        function prev() { goTo(activeIndex - 1); }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                next();
                restartAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                prev();
                restartAutoplay();
            });
        }

        carousel.addEventListener('touchstart', function (event) {
            if (!event.touches || !event.touches.length) return;
            touchStartX = event.touches[0].clientX;
            touchEndX = touchStartX;
        }, { passive: true });

        carousel.addEventListener('touchmove', function (event) {
            if (!event.touches || !event.touches.length) return;
            touchEndX = event.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', function () {
            var deltaX = touchEndX - touchStartX;
            if (Math.abs(deltaX) < 40) return;
            if (deltaX < 0) next();
            if (deltaX > 0) prev();
            restartAutoplay();
        });

        var autoplayId = null;
        function startAutoplay() {
            if (slides.length <= 1) return;
            autoplayId = setInterval(function () { next(); }, autoplayDelay);
            carouselIntervals.push(autoplayId);
        }

        function stopAutoplay() {
            if (autoplayId) {
                clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);

        updateUI();
        startAutoplay();
    });
}

window.addEventListener('beforeunload', function () {
    sliderIntervals.forEach(function (intervalId) { clearInterval(intervalId); });
    carouselIntervals.forEach(function (intervalId) { clearInterval(intervalId); });
});

// Close mobile nav when a link inside it is clicked
document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
    initProgramCarousels();
    document.querySelectorAll('#mobile-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            var nav = document.getElementById('mobile-nav');
            var icon = document.getElementById('mobile-nav-icon');
            if (nav) nav.classList.remove('open');
            if (icon) icon.textContent = 'menu';
        });
    });
});

// ─── Scroll entrance animations ──────────────────────────────
(function () {
    var els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers: show everything immediately
        els.forEach(function (el) { el.classList.add('in-view'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
})();

// Newsletter subscribe handler – used in all page footers
function subscribeNewsletter(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    const subject = encodeURIComponent('Newsletter Subscription – HopeRise');
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\nPlease add me to your newsletter mailing list.\n\nMy email address: ' + email + '\n\nThank you!'
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}

// Volunteer form submit handler – sends info via mailto
function submitVolunteerForm(e) {
    e.preventDefault();
    const firstName = document.getElementById('vol-first-name') ? document.getElementById('vol-first-name').value.trim() : '';
    const lastName = document.getElementById('vol-last-name') ? document.getElementById('vol-last-name').value.trim() : '';
    const email = document.getElementById('vol-email') ? document.getElementById('vol-email').value.trim() : '';
    const interest = document.getElementById('vol-interest') ? document.getElementById('vol-interest').value : '';
    const message = document.getElementById('vol-message') ? document.getElementById('vol-message').value.trim() : '';

    const subject = encodeURIComponent('Volunteer Application – HopeRise');
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\nI would like to volunteer with your organisation.\n\n' +
        '--- VOLUNTEER APPLICATION ---\n' +
        'Name: ' + firstName + ' ' + lastName + '\n' +
        'Email: ' + email + '\n' +
        'Area of Interest: ' + interest + '\n' +
        (message ? '\nMessage:\n' + message + '\n' : '') +
        '\n--- END OF APPLICATION ---\n\nThank you,\n' + firstName + ' ' + lastName
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}

// Contact form submit handler
function submitContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name') ? document.getElementById('contact-name').value.trim() : '';
    const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '';
    const phone = document.getElementById('contact-phone') ? document.getElementById('contact-phone').value.trim() : '';
    const subject_val = document.getElementById('contact-subject') ? document.getElementById('contact-subject').value.trim() : '';
    const message = document.getElementById('contact-message') ? document.getElementById('contact-message').value.trim() : '';

    const subject = encodeURIComponent('Website Contact – ' + (subject_val || 'General Enquiry'));
    const body = encodeURIComponent(
        'Dear HopeRise Team,\n\n' +
        '--- CONTACT FORM SUBMISSION ---\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (phone ? 'Phone: ' + phone + '\n' : '') +
        (subject_val ? 'Subject: ' + subject_val + '\n' : '') +
        (message ? '\nMessage:\n' + message + '\n' : '') +
        '\n--- END OF SUBMISSION ---\n\nThank you,\n' + name
    );
    window.location.href = 'mailto:hoperiseuganda@gmail.com?subject=' + subject + '&body=' + body;
}
