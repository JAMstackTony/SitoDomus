document.addEventListener('DOMContentLoaded', function () {
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach((container) => {
        const images = container.querySelectorAll('.carousel-image');
        const prevButton = container.querySelector('.carousel-btn.prev');
        const nextButton = container.querySelector('.carousel-btn.next');

        if (!prevButton || !nextButton || images.length === 0) {
            console.warn('Карусель не настроена для контейнера:', container);
            return;
        }

        let currentIndex = 0;

        function updateCarousel(newIndex) {
            images[currentIndex].classList.remove('active');
            images[newIndex].classList.add('active');
            currentIndex = newIndex;
        }

        // Листаем влево
        prevButton.addEventListener('click', () => {
            let newIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel(newIndex);
        });

        // Листаем вправо
        nextButton.addEventListener('click', () => {
            let newIndex = (currentIndex + 1) % images.length;
            updateCarousel(newIndex);
        });

        // Добавляем обработку свайпов для мобильных устройств
        let startX = 0;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].clientX;
            let swipeThreshold = 50; // Минимальная длина свайпа для срабатывания
            if (startX - endX > swipeThreshold) {
                let newIndex = (currentIndex + 1) % images.length;
                updateCarousel(newIndex);
            } else if (endX - startX > swipeThreshold) {
                let newIndex = (currentIndex - 1 + images.length) % images.length;
                updateCarousel(newIndex);
            }
        });

        // Инициализация первой картинки
        images[0].classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const loadMoreButton = document.getElementById("loadMoreButton");
  const allBlocks = Array.from(document.querySelectorAll(".bottom-block"));
  const step = 10;
  let currentIndex = 10;

  loadMoreButton.addEventListener("click", function () {
    for (let i = currentIndex; i < currentIndex + step && i < allBlocks.length; i++) {
      allBlocks[i].style.display = "flex";
    }
    currentIndex += step;

    if (currentIndex >= allBlocks.length) {
      loadMoreButton.style.display = "none";
    }
  });
});
