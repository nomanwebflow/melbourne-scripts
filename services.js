document.addEventListener("DOMContentLoaded", () => {
  const MENU_BUTTON_SELECTOR = ".service_tab_button";
  const menuBtns = document.querySelectorAll(MENU_BUTTON_SELECTOR);

  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
      // Optional: remove hash after navigation
      setTimeout(() => {
        if (typeof removeHash === "function") {
          removeHash();
        }
      });
    });
  });
});

window.addEventListener("load", setButtonWidths);
window.addEventListener("resize", setButtonWidths);

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);

  // GSAP Defaults
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  gsap.defaults({ ease: "main", duration: 1 });

  const nav = document.querySelector(".nav_component");
  const tabsNav = document.querySelector(".service_tab_menu");
  const serviceSection = document.querySelector(".service_section");

  // Pin service tab menu on scroll
  ScrollTrigger.create({
    trigger: tabsNav,
    start: "top 4rem",
    onEnter: () => tabsNav?.classList.add("is-fixed"),
    onLeaveBack: () => tabsNav?.classList.remove("is-fixed"),
  });

  const toggleY = (target, y) => {
    gsap.to(target, { yPercent: y });
  };

  const mm = gsap.matchMedia();

  mm.add("(max-width: 767px)", () => {
    if (!serviceSection || !tabsNav || !nav) return;
    ScrollTrigger.create({
      trigger: serviceSection,
      start: "top 75%",
      end: "bottom bottom",
      markers: true,
      onEnter: () => toggleY(tabsNav, 0),
      onLeave: () => toggleY(tabsNav, 150),
      onEnterBack: () => toggleY(tabsNav, 0),
      onLeaveBack: () => toggleY(tabsNav, 150),
    });
  });
  
  mm.add("(min-width: 768px)", () => {
    if (!serviceSection || !tabsNav || !nav) return;

    ScrollTrigger.create({
      trigger: serviceSection,
      start: "bottom 70%",
      end: "70% bottom",
      onLeave: () => toggleY(tabsNav, -250),
      onEnterBack: () => toggleY(tabsNav, 0),
    });

    ScrollTrigger.create({
      trigger: serviceSection,
      start: "top 75%",
      end: "bottom bottom",
      onEnter: () => toggleY(tabsNav, 0),
      onLeave: () => toggleY(tabsNav, 150),
      onEnterBack: () => toggleY(tabsNav, 0),
      onLeaveBack: () => toggleY(tabsNav, 150),
    });

    ScrollTrigger.create({
      trigger: serviceSection,
      start: "top center",
      end: "bottom top",
      onEnter: () => toggleY(nav, -150),
      onLeave: () => toggleY(nav, 0),
      onEnterBack: () => toggleY(nav, -150),
      onLeaveBack: () => toggleY(nav, 0),
    });
  });

  // Swiper & Tabs functionality
  document.querySelectorAll(".service_section").forEach((section) => {
    const buttons = section.querySelectorAll(".service_tab_button");
    const bgElement = section.querySelector(".service_tab_bg");

    const moveBgTo = (button) => {
      if (!button || !bgElement || button === bgElement.parentNode) return;
      const state = Flip.getState(bgElement);
      button.appendChild(bgElement);
      Flip.from(state, { delay: 0.1, duration: 0.4, ease: "power1.inOut", absolute: true });
    };

    // Observe class changes for tabs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target.classList.contains("w--current")
        ) {
          moveBgTo(mutation.target);
        }
      });
    });

    buttons.forEach((btn) => {
      observer.observe(btn, { attributes: true, attributeFilter: ["class"] });
    });

    // Move background to active tab on load
    const current = section.querySelector(".service_tab_button.w--current");
    if (current) moveBgTo(current);
  });
});
