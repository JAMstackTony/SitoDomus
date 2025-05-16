document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.carousel-image');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');

    let currentIndex = 0;

    function updateCarousel() {
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    // 💥 СВАЙП (ТАЧ)
    let startX = 0;
    let endX = 0;

    const carouselContainer = document.querySelector('.carousel-container'); // или .carousel-images

    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = startX - endX;
        const threshold = 50; // минимальное расстояние для свайпа

        if (diff > threshold) {
            // свайп влево (следующий)
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        } else if (diff < -threshold) {
            // свайп вправо (предыдущий)
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
    }

    updateCarousel(); // первичная инициализация
});

