const MOBILE_SECTION_SELECTOR = "main section, aside section";
const SECTION_TITLE_SELECTOR = ".section-title";
const TOGGLE_BUTTON_CLASS = "mobile-collapsible__toggle";
const MOBILE_MEDIA_QUERY = "(max-width: 699px)";

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(MOBILE_SECTION_SELECTOR);
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  let collapsibleSections = [];

  const openSectionFromHash = () => {
    if (!window.location.hash || !mediaQuery.matches) return;

    const target = document.getElementById(window.location.hash.slice(1));
    const section = target?.closest("section");
    const collapsibleSection = collapsibleSections.find((item) => item.section === section);

    if (!collapsibleSection) return;

    collapsibleSection.section.classList.add("mobile-collapsible--open");
    collapsibleSection.toggleButton.textContent = "-";
    collapsibleSection.toggleButton.setAttribute("aria-label", `Close ${collapsibleSection.titleText}`);
    collapsibleSection.toggleButton.setAttribute("aria-expanded", "true");
  };

  const initMobileSections = () => {
    if (collapsibleSections.length) return;

    sections.forEach((section, index) => {
      const title = [...section.children].find((child) => child.matches(SECTION_TITLE_SELECTOR));
      if (!title) return;

      const contentItems = [...section.children].filter((child) => child !== title);
      if (!contentItems.length) return;

      const titleText = title.textContent.trim();
      const contentId = `mobile-section-content-${index}`;
      const contentWrapper = document.createElement("div");
      const contentInner = document.createElement("div");
      contentWrapper.className = "mobile-collapsible__content";
      contentInner.className = "mobile-collapsible__content-inner";
      contentWrapper.id = contentId;

      const toggleButton = document.createElement("button");
      toggleButton.className = TOGGLE_BUTTON_CLASS;
      toggleButton.type = "button";
      toggleButton.textContent = "+";
      toggleButton.setAttribute("aria-label", `Open ${titleText}`);
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("aria-controls", contentId);

      section.classList.add("mobile-collapsible");
      title.append(toggleButton);
      title.after(contentWrapper);
      contentWrapper.append(contentInner);
      contentItems.forEach((item) => contentInner.append(item));

      const toggleSection = () => {
        const isOpen = section.classList.toggle("mobile-collapsible--open");
        toggleButton.textContent = isOpen ? "-" : "+";
        toggleButton.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} ${titleText}`);
        toggleButton.setAttribute("aria-expanded", String(isOpen));
      };

      toggleButton.addEventListener("click", toggleSection);
      collapsibleSections.push({
        section,
        contentItems,
        contentWrapper,
        toggleButton,
        contentId,
        titleText,
      });
    });

    openSectionFromHash();
  };

  const destroyMobileSections = () => {
    collapsibleSections.forEach(
      ({ section, contentItems, contentWrapper, toggleButton }) => {
        section.classList.remove("mobile-collapsible", "mobile-collapsible--open");
        toggleButton.remove();

        contentItems.forEach((item) => {
          contentWrapper.before(item);
        });

        contentWrapper.remove();
      }
    );

    collapsibleSections = [];
  };

  const syncMobileSections = () => {
    if (mediaQuery.matches) {
      initMobileSections();
      return;
    }

    destroyMobileSections();
  };

  syncMobileSections();
  mediaQuery.addEventListener("change", syncMobileSections);
  window.addEventListener("hashchange", openSectionFromHash);
});
