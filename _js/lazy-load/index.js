import { setBackgroundImages } from "./backgrounds";
import { getImageRatio , initDomImages } from "./images";
const all_images = document.querySelectorAll('img');

getImageRatio(all_images);
if(all_images.length) {
  
  window.onload = () => {
    let allImages = document.querySelectorAll('img');
    initDomImages(allImages)
    setBackgroundImages();
  };
}
