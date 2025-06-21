// slideshow.js

document.addEventListener('DOMContentLoaded', () => {
  const slideshows = document.querySelectorAll('.slideshow-container');

  slideshows.forEach(slideshow => {
    let currentSlide = 0;
    const slides = slideshow.querySelectorAll('.slide');
    const prevButton = slideshow.querySelector('.prev');
    const nextButton = slideshow.querySelector('.next');
    const maximizeButton = slideshow.querySelector('.maximize-slideshow');
    const slideCounter = slideshow.querySelector('.slide-counter');

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
      });
      if (slideCounter) {
        slideCounter.textContent = `${index + 1} / ${slides.length}`;
      }
      currentSlide = index;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }

    if (maximizeButton) {
      maximizeButton.textContent = 'Fullscreen'; // Initial text
      maximizeButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          slideshow.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    // Update button text based on fullscreen state changes (e.g. ESC key press)
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement === slideshow) {
        maximizeButton.textContent = 'Exit Fullscreen';
      } else {
        maximizeButton.textContent = 'Fullscreen';
      }
    });

    // Initialize the first slide
    if (slides.length > 0) {
      showSlide(0);
    }

    // Swipe navigation
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe

    slideshow.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
    }, false);

    slideshow.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (touchendX < touchstartX - swipeThreshold) {
        // Swiped left
        nextSlide();
      }
      if (touchendX > touchstartX + swipeThreshold) {
        // Swiped right
        prevSlide();
      }
    }

  });

  // Keyboard navigation for all slideshows on the page
  document.addEventListener('keydown', (e) => {
    let targetSlideshow = null;

    if (document.fullscreenElement && document.fullscreenElement.classList.contains('slideshow-container')) {
      targetSlideshow = document.fullscreenElement;
    } else if (!document.fullscreenElement) {
      // If not in fullscreen, find the first visible slideshow.
      // This heuristic might need adjustment if multiple non-fullscreen slideshows are interactive.
      const allSlideshows = document.querySelectorAll('.slideshow-container');
      for (let ss of allSlideshows) {
        if (ss.offsetParent !== null) { // A simple check for visibility
          targetSlideshow = ss;
          break;
        }
      }
    }

    if (targetSlideshow) {
      const nextButton = targetSlideshow.querySelector('.next');
      const prevButton = targetSlideshow.querySelector('.prev');

      if (e.key === 'ArrowRight' && nextButton) {
        // Prevent default browser action for arrow keys if they might scroll the page
        // especially when an element inside the slideshow might have focus.
        // However, fullscreen often traps events, so this might not be strictly necessary there.
        // e.preventDefault();
        nextButton.click();
      } else if (e.key === 'ArrowLeft' && prevButton) {
        // e.preventDefault();
        prevButton.click();
      }
    }
  });
});
