import { initMasonry, destroyMasonry } from "../massonry/index.js";
import { setupLightBox } from "../lightbox/setupLightBox.js";

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector(".cert-gallery");
  if (!grid) return;
  let msnry = null;

  function handleResponsive() {
    if (window.innerWidth < 600) {
      destroyMasonry(msnry, grid);
    } else if (!msnry) {
      initMasonry(msnry, grid);
    }
  }

  handleResponsive();
  window.addEventListener("resize", handleResponsive);
  setupLightBox();
});
