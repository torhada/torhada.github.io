/* Shared interactions for the portfolio. */
(function () {
    // Reveal grayscale images to full color on hover (matches the "gallery" feel).
    document.querySelectorAll('[data-grayscale]').forEach(function (img) {
        img.addEventListener('mouseenter', function () {
            img.style.filter = 'grayscale(0%)';
        });
        img.addEventListener('mouseleave', function () {
            img.style.filter = 'grayscale(100%)';
        });
    });

    // Add a hairline shadow to the header once the page is scrolled.
    var header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('shadow-sm');
            } else {
                header.classList.remove('shadow-sm');
            }
        });
    }

    // Simple fade-in-on-scroll for elements marked with [data-reveal].
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && revealEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) {
            el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
            observer.observe(el);
        });
    }
})();
