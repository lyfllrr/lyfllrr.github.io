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

  ul.slideshow-container {
    width: 12px;
    height: 12px;
    background-color: gray;
    margin: 0 5px;
  }

  ul.slideshow-container {
    background-color: #007bff;
  }

  details {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }

  summary {
    font-weight: bold;
    cursor: pointer;

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
          a.setAttribute("target","_blank");
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

      const showSlide = () => {
        const slides = slideshowDiv.getElementsByTagName('img');
        for (const slide of slides) {
          slide.classList.remove('active');
        }
        slides[slideIndex].classList.add('active');
      };

      const showSlides = () => {
        slideIndex = (slideIndex + 1) % images.length;
        showSlide();
        setTimeout(showSlides, 3000); // Change slide every 3 seconds
      };

      showSlides();
    }
  }

  function createSlideshows() {
    const container = document.getElementById('recommendlist');
    const ulElements = container.parentElement.parentElement.querySelectorAll('ul');
    for (const ul of ulElements) {
      const firstLi = ul.querySelector('li'); // Get the first <li> element
      if (firstLi) {
        // Create a <details> element
        const details = document.createElement('details');

        // Use the text content of the first <li> as <summary> text
        const summary = document.createElement('summary');
        summary.textContent = firstLi.textContent.split("\n")[0];
        details.appendChild(summary);

        // Insert the <details> before the original <ul>
        ul.parentNode.insertBefore(details, ul);

        // Move the <ul> inside the <details>
        details.appendChild(ul);

        // Create the slideshow inside the <details>
        createSlideshowForItem(ul);
      }
    }
  }

  // Call the function after the DOM is loaded
  document.addEventListener('DOMContentLoaded', createSlideshows);