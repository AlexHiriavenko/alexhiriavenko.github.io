export function initMasonry(msnry, grid) {
  msnry = new Masonry(grid, {
    itemSelector: ".cert-item",
    columnWidth: ".grid-sizer",
    gutter: 16,
    percentPosition: false,
    fitWidth: true,
  });

  imagesLoaded(grid, () => {
    msnry.reloadItems();
    msnry.layout();
  });
}
