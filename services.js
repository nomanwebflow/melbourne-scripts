document.addEventListener("DOMContentLoaded", () => {
  const MENU_BUTTON_SELECTOR = ".service_tab_button";
  const menuBtns = document.querySelectorAll(MENU_BUTTON_SELECTOR);

  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
      // Allow hash to be set by adding a small delay
      setTimeout(removeHash);
    });
  });
});
window.addEventListener("load", function () {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  document.querySelectorAll(".service_tab_button").forEach((element) => {
    let widthInRem = element.offsetWidth / rootFontSize;
    element.style.width = widthInRem + "rem";
  });
});

$(document).ready(function () {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);

  // GSAP defaults
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  gsap.defaults({ ease: "main", duration: 1 });

  ScrollTrigger.create({
    trigger: ".service_tab_menu",
    start: "top 4rem", // when the top of the element hits 8rem from top of viewport
    onEnter: () =>
      document.querySelector(".service_tab_menu")?.classList.add("is-fixed"),
    onLeaveBack: () =>
      document.querySelector(".service_tab_menu")?.classList.remove("is-fixed"),
    // optional: markers: true, to debug
  });

  const nav = document.querySelector(".nav_component");
  const tabsNav = document.querySelector(".service_tab_menu");
  const serviceSection = document.querySelector(".service_section");

  gsap.registerPlugin(ScrollTrigger);

  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    ScrollTrigger.create({
      trigger: serviceSection,
      start: "bottom 70%",
      end: "70% bottom",
      ease: "main",
      duration: 0.2,
      onLeave: () => gsap.to(tabsNav, { y: "-250%" }),
      onEnterBack: () => gsap.to(tabsNav, { y: "0%" }),
    });

    if (serviceSection) {
      ScrollTrigger.create({
        trigger: serviceSection,
        start: "top center",
        end: "bottom top",
        onEnter: () => {
          gsap.to(nav, {
            yPercent: -150,
          });
        },
        onLeave: () => {
          gsap.to(nav, {
            yPercent: 0,
          });
        },
        onEnterBack: () => {
          gsap.to(nav, {
            yPercent: -150,
          });
        },
        onLeaveBack: () => {
          gsap.to(nav, {
            yPercent: 0,
          });
        },
      });
    }
  });

  // Swiper & Tabs functionality
  $(".service_section").each(function () {
    const $section = $(this);
    const $buttons = $section.find(".service_tab_button");
    const navCorners = $section.find(".service_tab_bg")[0];

    function moveBgTo(button) {
      if (!button || button === navCorners.parentNode) return;
      const state = Flip.getState(navCorners);
      button.appendChild(navCorners);
      Flip.from(state, { duration: 0.4, ease: "power1.inOut", absolute: true });
    }

    // Observe class changes on each button
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;
          if (target.classList.contains("w--current")) {
            moveBgTo(target);
          }
        }
      }
    });

    $buttons.each(function () {
      observer.observe(this, { attributes: true, attributeFilter: ["class"] });
    });

    // On load: Move background to the button with class w--current
    const current = $section.find(".service_tab_button.w--current")[0];
    moveBgTo(current);
  });
});
