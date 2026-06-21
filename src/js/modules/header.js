document.addEventListener("DOMContentLoaded", () => {
  const burgerButton = document.querySelector(".burger-btn");
  const navList = document.querySelector(".nav-list");

  if (!burgerButton || !navList) return;

  navList.id ||= "main-navigation";
  burgerButton.type = "button";
  burgerButton.setAttribute("aria-controls", navList.id);
  burgerButton.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    navList.classList.remove("nav-list--active");
    burgerButton.setAttribute("aria-expanded", "false");
  };

  burgerButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("nav-list--active");
    burgerButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!navList.classList.contains("nav-list--active")) return;
    if (navList.contains(event.target) || burgerButton.contains(event.target)) return;

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!navList.classList.contains("nav-list--active")) return;

    closeMenu();
  });
});
