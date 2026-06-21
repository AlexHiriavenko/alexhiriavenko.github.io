export function destroyMasonry(msnry, grid) {
  if (msnry) {
    msnry.destroy();
    msnry = null;
    grid.style.height = "auto";
    grid.querySelectorAll(".cert-item").forEach((el) => {
      el.style.position = "";
      el.style.top = "";
      el.style.left = "";
    });
  }
}
