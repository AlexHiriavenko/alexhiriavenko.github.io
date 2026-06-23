const STORAGE_KEY = "preferredLocale";
const DEFAULT_LOCALE = "en";
const HOME_ROUTE = "home";

document.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector("[data-language-select]");

  if (!select) return;

  const currentLocale = select.dataset.currentLocale || DEFAULT_LOCALE;
  const currentRoute = select.dataset.currentRoute || HOME_ROUTE;
  const savedLocale = localStorage.getItem(STORAGE_KEY);
  const savedOption = savedLocale
    ? select.querySelector(`option[data-locale="${savedLocale}"]`)
    : null;

  if (
    savedOption &&
    savedLocale !== currentLocale &&
    currentLocale === DEFAULT_LOCALE &&
    currentRoute === HOME_ROUTE
  ) {
    window.location.assign(savedOption.value);
    return;
  }

  select.addEventListener("change", () => {
    const selectedOption = select.selectedOptions[0];
    const nextLocale = selectedOption?.dataset.locale;
    const nextUrl = select.value;

    if (!nextLocale || !nextUrl) return;

    localStorage.setItem(STORAGE_KEY, nextLocale);
    window.location.assign(nextUrl);
  });
});
