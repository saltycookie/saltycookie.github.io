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

  // Keyboard navigation for all slideshows on the page (if any are active/visible)
  document.addEventListener('keydown', (e) => {
    // Find the currently "active" slideshow. This is a simple heuristic:
    // It assumes the first visible slideshow or the maximized one is the target.
    // More complex scenarios might need a more robust way to determine the active slideshow.
    let activeSlideshow = document.querySelector('.slideshow-maximized');
    if (!activeSlideshow) {
      // If no slideshow is maximized, find the first one that's at least partially visible.
      // This part is tricky without knowing exact layout or if multiple slideshows are present.
      // For simplicity, we'll just target the first slideshow found if not maximized.
      // A better approach might involve checking if the slideshow is in the viewport.
      const allSlideshows = document.querySelectorAll('.slideshow-container');
      if (allSlideshows.length > 0) {
          // Check if any slideshow is currently visible (e.g. not display:none itself or an ancestor)
          for(let ss of allSlideshows) {
              if (ss.offsetParent !== null) { // A simple check for visibility
                  activeSlideshow = ss;
                  break;
              }
          }
      }
    }

    if (activeSlideshow) {
      // We need to find the specific functions (nextSlide, prevSlide) for this active slideshow.
      // The current structure of slideshow.js scopes these functions.
      // To make this work cleanly, we might need to refactor how slideshows are managed
      // or re-select buttons within the activeSlideshow context here.

      // For now, let's assume we can find the buttons and trigger a click.
      // This is a workaround. A better way would be to have access to nextSlide/prevSlide directly.
      const nextButton = activeSlideshow.querySelector('.next');
      const prevButton = activeSlideshow.querySelector('.prev');

      if (e.key === 'ArrowRight' && nextButton) {
        nextButton.click(); // Trigger the click event on the next button
      } else if (e.key === 'ArrowLeft' && prevButton) {
        prevButton.click(); // Trigger the click event on the prev button
      }
    }
  });
});
