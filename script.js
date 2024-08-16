// Determine if a bento box is visible on the screen
document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll('.bento-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.6
    });

    boxes.forEach(box => {
        observer.observe(box);
    });
});
