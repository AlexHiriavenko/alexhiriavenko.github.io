export function setupLightBox() {
  const grid = document.querySelector(".cert-gallery");
  const lb = document.getElementById("lightbox");
  const img = lb?.querySelector(".lb__img");

  if (!grid || !lb || !img) return;

  // Открытие: берём data-full, если есть, иначе src
  grid.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;

    const full = target.getAttribute("data-full") || target.src;
    img.src = full;
    img.alt = target.alt || "Certificate";

    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("lb--open"));
    document.body.classList.add("body--lock");
  });

  // Закрытие: по клику на backdrop/крестик
  lb.addEventListener("click", (e) => {
    const closeBtnOrBackdrop = e.target.closest("[data-lb-close]");
    if (!closeBtnOrBackdrop) return;
    closeLightbox();
  });

  // Закрытие: по ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lb.hidden) closeLightbox();
  });

  function closeLightbox() {
    lb.classList.remove("lb--open");
    document.body.classList.remove("body--lock");
    // дождёмся окончания анимации и спрячем
    setTimeout(() => {
      lb.hidden = true;
      img.removeAttribute("src"); // освобождаем память на мобилках
    }, 200);
  }
}
