// Dynamically create and insert the styles
const styleElement = document.createElement('style');
styleElement.textContent = `
.slideshow-container {
    max-width: 1000px;
    position: relative;
    margin: auto;
  }

  .slideshow-container img {
    display: none;
    max-width: 100%;
  }

  .slideshow-container img.active {
    display: block;
  }

  .progress-bar {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: gray;
    margin: 0 5px;
    cursor: pointer;
    position: relative;
  }

  .progress-dot.active {
    background-color: #007bff;
  }

  /* Adjusted the positioning of the progress dot's pseudo-element */
  .progress-dot.active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #fff;
  }
`;
document.head.appendChild(styleElement);

function createSlideshowForItem(ulElement) {
    const liElements = ulElement.getElementsByTagName('li');
    let slideIndex = 0;
    let images = [];
    let recommendUrl = null;

    for (const li of liElements) {
      const text = li.textContent.trim();
      if (text.startsWith('img:')) {
        images.push(text.substring(4).trim());
        li.style.display = 'none'; // Hide the original <li> elements
      } else if (text.startsWith('recommendurl:')) {
        recommendUrl = text.substring(13).trim();
        li.style.display = 'none'; // Hide the original <li> elements
      }
    }

    if (images.length > 0) {
      const slideshowDiv = document.createElement('div');
      slideshowDiv.classList.add('slideshow-container');

      images.forEach((imageUrl, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        const img = document.createElement('img');
        img.src = imageUrl;
        if (index === 0) {
          img.classList.add('active');
        }
        if (recommendUrl) {
          const a = document.createElement('a');
          a.href = recommendUrl;
          a.appendChild(img);
          imgContainer.appendChild(a);
        } else {
          imgContainer.appendChild(img);
        }
        slideshowDiv.appendChild(imgContainer);
      });

      // Add the slideshow div inside the <ul> element
      ulElement.appendChild(slideshowDiv);

      const progressDiv = document.createElement('div');
      progressDiv.classList.add('progress-bar');

      images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        if (index === 0) {
          dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
          slideIndex = index;
          showSlide();
        });
        progressDiv.appendChild(dot);
      });

      ulElement.appendChild(progressDiv);

      const showSlide = () => {
        const slides = slideshowDiv.getElementsByTagName('img');
        const dots = progressDiv.getElementsByClassName('progress-dot');
        for (const slide of slides) {
          slide.classList.remove('active');
        }
        for (const dot of dots) {
          dot.classList.remove('active');
        }
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
      };

      const showSlides = () => {
        slideIndex = (slideIndex + 1) % images.length;
        showSlide();
        setTimeout(showSlides, 2000); // Change slide every 2 seconds
      };

      showSlides();
    }
  }

  function createSlideshows() {
    const ulElements = document.getElementsByTagName('ul');
    for (const ul of ulElements) {
      createSlideshowForItem(ul);
    }
  }

  // Call the function after the DOM is loaded
  document.addEventListener('DOMContentLoaded', createSlideshows);