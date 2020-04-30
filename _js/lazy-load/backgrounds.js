require('intersection-observer');

const config  = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const setBackgroundImages = () => {
  let backgrounds = document.querySelectorAll('.bg__el')
  let observer = new IntersectionObserver((element) => {
    
    element.forEach(backgroundElement => {

      if(backgroundElement.intersectionRatio > 0) {
        
        const img = new Image();
        img.src = backgroundElement.target.getAttribute('data-bg');

        img.onload = () => {
          backgroundElement.target.style.backgroundImage = 'url('+ img.src +')'
          backgroundElement.target.closest('.bg').classList.add('active')
          backgroundElement.target.setAttribute('data-bg', '')
        }
      }
    })
  }, config)
  
  backgrounds.forEach(image => {
    observer.observe(image)
  })
}

export { setBackgroundImages };