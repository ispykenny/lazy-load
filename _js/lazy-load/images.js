require('intersection-observer');

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const setDomElement = (element, ratio, src, alt) => {
  element.setAttribute("src", "");
  const wrapperEl = document.createElement("div");
  const parentEl = element.parentElement;

  wrapperEl.setAttribute("class", "image-el");
  wrapperEl.setAttribute(
    "style",
    "position: relative; width: auto; height: 0px;"
  );
  wrapperEl.innerHTML = `<img class="lazy-image" src='' data-src='${src}' alt='${alt}'>`;
  wrapperEl.style.paddingBottom = (ratio.height / ratio.width) * 100 + "%";

  parentEl.innerHTML = "";
  parentEl.appendChild(wrapperEl);

  document.querySelectorAll(".lazy-image").forEach((image) => {
    image.setAttribute(
      "style",
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    );
  });
};

const getImageRatio = (allDomImages) => {
  let imgElement = allDomImages;

  imgElement.forEach((element) => {
    const src = element.getAttribute("src");
    const alt = element.getAttribute("alt");

    if (element.offsetHeight <= 0) {
      let setDem = setInterval(() => {
        if (element.offsetHeight > 0) {
          const imageRatio = {
            height: element.offsetHeight,
            width: element.offsetWidth,
          };
          setDomElement(element, imageRatio, src, alt);
          clearInterval(setDem);
        }
      });
    } else {
      const imageRatio = {
        height: element.offsetHeight,
        width: element.offsetWidth,
      };
      setDomElement(element, imageRatio, src, alt);
    }
  });
};

const initDomImages = (domImages) => {
  let observer = new IntersectionObserver((element) => {

    element.forEach((domImage) => {
      if (domImage.intersectionRatio > 0) {
        const img = new Image();
        img.src = domImage.target.getAttribute("data-src");
        img.onload = () => {
          domImage.target.setAttribute("src", img.src);
          domImage.target.classList.add("loaded");
        };
      }
    });
  }, observerOptions);


  domImages.forEach((image) => {
    observer.observe(image);
  });
};

export { getImageRatio, initDomImages };
