document.addEventListener("click", function (event) {
  const target = event.target.closest("[data-link-copy]");
  if (target && target._tippy) {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        const originalText = "Copy link";

        // Set tooltip to "Copied!"
        target._tippy.setContent("Copied!");
        target._tippy.show();

        // Listen for when the user stops hovering
        const handleMouseLeave = () => {
          target._tippy.setContent(originalText);
          target.removeEventListener("mouseleave", handleMouseLeave);
        };

        target.addEventListener("mouseleave", handleMouseLeave);
      })
      .catch((err) => console.error("Failed to copy:", err));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const MENU_BUTTON_SELECTOR = "[data-service-collapse-button]";
  const menuBtns = document.querySelectorAll(MENU_BUTTON_SELECTOR);

  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
      // Allow hash to be set by adding a small delay
      setTimeout(removeHash);
    });
  });
});

/**
 * Remove the hash from the URL.
 */
function removeHash() {
  history.replaceState(
    null,
    document.title,
    `${window.location.origin}${window.location.pathname}${window.location.search}`
  );
}

$("[data-service-expand-button]").on("click", function () {
  $(".home_services_bottom").addClass("is-expanded");
});

$("[data-service-collapse-button]").on("click", function () {
  $(".home_services_bottom").removeClass("is-expanded");
});

document.addEventListener("DOMContentLoaded", () => {
  // Select all FAQ lists
  const faqLists = document.querySelectorAll('[faq-element="list"]');

  faqLists.forEach((list) => {
    const headers = list.querySelectorAll('[faq-element="header"]');
    const accordions = list.querySelectorAll('[faq-element="accordion"]');

    // Reset all accordions and set numbers
    accordions.forEach((accordion, index) => {
      accordion.classList.remove("is-open");
      const numberEl = accordion.querySelector("[data-faq-number]");
      if (numberEl) {
        numberEl.textContent = String(index + 1).padStart(2, "0");
      }
    });

    // Open the first accordion by default (optional)
    if (headers[0]) {
      const firstAccordion = headers[0].closest('[faq-element="accordion"]');
      if (firstAccordion) {
        firstAccordion.classList.add("is-open");
      }
    }

    // Add toggle event to each header
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const accordion = header.closest('[faq-element="accordion"]');

        if (accordion.classList.contains("is-open")) {
          accordion.classList.remove("is-open");
        } else {
          // Close all in this specific list
          accordions.forEach((acc) => acc.classList.remove("is-open"));
          accordion.classList.add("is-open");
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Global GSAP Defaults
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  gsap.defaults({ ease: "main", duration: 1 });

  const triggerElement = document.querySelector("[hero-content]");
  const targetHeight = triggerElement?.offsetHeight || 650; // fallback if not found

  gsap.fromTo(
    "[hero-content]",
    { scale: 1, filter: "blur(0px)" },
    {
      scale: 0.9,
      filter: "blur(10px)",
      ease: "none",
      scrollTrigger: {
        trigger: "[service-hero-trigger]",
        start: `top ${targetHeight}px`,
        end: "top top",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    "[data-scale-up]",
    { scale: "0.5", rotate: "10", autoAlpha: "0" },
    {
      scale: "1",
      autoAlpha: "1",
      rotate: "0",
      duration: 1.5,
      scrollTrigger: {
        trigger: "[data-scale-up]",
        start: "top 65%",
        toggleActions: "play none none none",
      },
    }
  );

  gsap.utils.toArray(".service_process_item").forEach((item) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 45%",
        toggleClass: "is-active",
      },
    });
  });

  gsap.utils.toArray(".service_process_item").forEach((item) => {
    const circ = item.querySelector(".service_process_circ");

    gsap.fromTo(
      circ,
      { scale: 1, backgroundColor: "#505050" },
      {
        scale: 1.6667, // 1.5625 / 0.9375
        backgroundColor: "#FFC5B1",
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 35%",
          end: "top 25%",
          scrub: true,
        },
      }
    );
  });

  // Navigation Menu Functionality
  function initMenu() {
    const navWrap = document.querySelector(".nav");
    const overlay = navWrap.querySelector(".overlay");
    const menu = navWrap.querySelector(".menu");
    const bgPanels = navWrap.querySelectorAll(".bg-panel");
    const menuToggles = document.querySelectorAll("[data-menu-toggle]");
    const menuLinks = navWrap.querySelectorAll(".menu-link");
    const fadeTargets = navWrap.querySelectorAll("[data-menu-fade]");
    const menuButton = document.querySelector(".menu-button");
    const menuButtonTexts = menuButton.querySelectorAll("p");
    const menuButtonIcon = menuButton.querySelector(".menu-button-icon");
    const tl = gsap.timeline();

    // Add CSS class to disable scroll
    const disableScroll = () => (document.body.style.overflow = "clip");
    const enableScroll = () => (document.body.style.overflow = "");

    const openNav = () => {
      disableScroll();
      navWrap.setAttribute("data-nav", "open");
      tl.clear()
        .set(navWrap, { display: "block" })
        .set(menu, { xPercent: 0 }, "<")
        .fromTo(
          menuButtonTexts,
          { yPercent: 0 },
          { yPercent: -100, stagger: 0.2 }
        )
        .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
        .fromTo(
          bgPanels,
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575 },
          "<"
        )
        .fromTo(
          menuLinks,
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05 },
          "<+=0.35"
        )
        .fromTo(
          fadeTargets,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.04 },
          "<+=0.2"
        );
    };

    const closeNav = () => {
      enableScroll();
      navWrap.setAttribute("data-nav", "closed");
      tl.clear()
        .to(overlay, { autoAlpha: 0 })
        .to(menu, { xPercent: 120 }, "<")
        .to(menuButtonTexts, { yPercent: 0 }, "<")
        .to(menuButtonIcon, { rotate: 0 }, "<")
        .set(navWrap, { display: "none" });
    };

    menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const state = navWrap.getAttribute("data-nav");
        state === "open" ? closeNav() : openNav();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open")
        closeNav();
    });
  }
  initMenu();

  // Add visibility reset to handle SplitType's default hidden visibility
  gsap.set("[data-words-stagger] .word", { visibility: "visible" });

  // Standard Stagger Animations
  document.querySelectorAll("[data-standard-stagger]").forEach((element) => {
    gsap.fromTo(
      element.querySelectorAll(":scope > *"),
      { autoAlpha: 0, y: "5rem" },
      {
        autoAlpha: 1,
        y: "0rem",
        stagger: 0.06,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  document.querySelectorAll("[data-words-stagger]").forEach((element) => {
    gsap.fromTo(
      element.querySelectorAll(".word"),
      {
        yPercent: 140,
        autoAlpha: 0,
        rotate: 10,
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        rotate: 0,
        stagger: 0.04,
        scrollTrigger: {
          trigger: element,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  document.querySelectorAll("[data-lines-stagger]").forEach((element) => {
    gsap.fromTo(
      element.querySelectorAll(":scope > *"),
      { autoAlpha: 0, y: "5rem" },
      {
        autoAlpha: 1,
        y: "0rem",
        stagger: 0.06,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Scroll-based Animations
  gsap.matchMedia().add("(min-width: 1248px)", () => {
    gsap.fromTo(
      ".footer_component",
      { y: "50%" },
      {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".main-wrapper",
          start: "bottom bottom",
          end: "bottom 10%",
          scrub: true,
        },
      }
    );
  });

  gsap.matchMedia().add("(min-width: 767px)", () => {
    gsap.fromTo(
      ".main-wrapper",
      { borderBottomRightRadius: "3rem", borderBottomLeftRadius: "3rem" },
      {
        borderBottomRightRadius: "1rem",
        borderBottomLeftRadius: "1rem",
        scrollTrigger: {
          trigger: ".main-wrapper",
          start: "bottom bottom",
          end: "bottom 10%",
          scrub: true,
        },
      }
    );
  });

  // Smooth Scroll Initialization
  if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    const script = document.createElement("script");
    script.setAttribute("data-id-scroll", true);
    script.setAttribute("data-autoinit", true);
    script.setAttribute("data-duration", "1.5");
    script.setAttribute("data-orientation", "vertical");
    script.setAttribute("data-smoothWheel", true);
    script.setAttribute("data-smoothTouch", false);
    script.setAttribute("data-touchMultiplier", "1.5");
    script.setAttribute(
      "data-easing",
      "(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))"
    );
    script.setAttribute("data-useOverscroll", true);
    script.setAttribute("data-useControls", true);
    script.setAttribute("data-useAnchor", true);
    script.setAttribute("data-useRaf", true);
    script.setAttribute("data-infinite", false);
    script.setAttribute("defer", true);
    script.src =
      "https://assets-global.website-files.com/645e0e1ff7fdb6dc8c85f3a2/64a5544a813c7253b90f2f50_lenis-offbrand.txt";
    document.body.appendChild(script);
  }

  // Navigation Scroll Effects
  const nav = document.querySelector(".nav_component");
  const navContainer = document.querySelector(".nav_container");
  const navTrigger = document.querySelector(".page-wrapper");

  // Store the initial value of the data attribute
  const initialNavVariant = nav.getAttribute("data-wf--nav--variant");

  ScrollTrigger.create({
    trigger: navTrigger,
    start: "top top",
    end: "80px top",
    onEnterBack: () => {
      gsap.fromTo(
        navContainer,
        {
          maxWidth: "83rem",
          marginTop: "1.5rem",
        },
        {
          maxWidth: "100%",
          marginTop: "0rem",
        }
      );
      // Remove floating class when expanding to 100%
      nav.classList.remove("floating");
      // Reset the data attribute to its initial value
      if (initialNavVariant) {
        nav.setAttribute("data-wf--nav--variant", initialNavVariant);
      } else {
        nav.removeAttribute("data-wf--nav--variant");
      }
    },
    onLeave: () => {
      gsap.fromTo(
        navContainer,
        {
          maxWidth: "100%",
          marginTop: "0rem",
        },
        {
          maxWidth: "83rem",
          marginTop: "1.5rem",
        }
      );
      // Add floating class when condensing to 80rem
      nav.classList.add("floating");
      // Change the data attribute to 'light-mode'
      nav.setAttribute("data-wf--nav--variant", "light-mode");
    },
  });
  if (document.documentElement.scrollHeight >= window.innerHeight * 2) {
    ScrollTrigger.create({
      trigger: ".main-wrapper",
      start: "bottom 70%",
      end: "70% bottom",
      onLeave: () => gsap.to(nav, { y: "-150%" }),
      onEnterBack: () => gsap.to(nav, { y: "0%" }),
    });
  }

  // Parallax Layers Implementation
  const parallaxTrigger = document.querySelector("[data-parallax-layers]");
  if (parallaxTrigger) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxTrigger,
        start: "0% 50%",
        end: "100% 0%",
        scrub: 0,
      },
    });

    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 20 },
    ];

    layers.forEach((layerObj, idx) => {
      const layerElements = parallaxTrigger.querySelectorAll(
        `[data-parallax-layer="${layerObj.layer}"]`
      );
      if (layerElements.length > 0) {
        tl.to(
          layerElements,
          {
            yPercent: layerObj.yPercent,
            ease: "none",
          },
          idx === 0 ? undefined : "<"
        );
      }
    });
  }

  // Resize Handling
  const refreshScrollTrigger = debounce(() => ScrollTrigger.refresh());
  const resizeObserver = new ResizeObserver(() => refreshScrollTrigger());
  resizeObserver.observe(document.documentElement);
  resizeObserver.observe(document.body);

  // Dynamic Year Update
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("[footer-year]").forEach((element) => {
    element.textContent = currentYear;
  });

  // Helper Functions
  function debounce(func, timeout = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), timeout);
    };
  }
});

// About Hero
gsap.registerPlugin(ScrollTrigger);

let typeSplit;
// Split the text up
function runSplit() {
  typeSplit = new SplitType("[data-lines-stagger], [data-words-stagger]", {
    types: "lines, words",
  });
  createAnimation();
}
runSplit();
// Update on window resize
let windowWidth = $(window).innerWidth();
window.addEventListener("resize", function () {
  if (windowWidth !== $(window).innerWidth()) {
    windowWidth = $(window).innerWidth();
    typeSplit.revert();
    runSplit();
  }
});

function createAnimation() {
  $(".line").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 40%",
        end: "bottom center",
        scrub: 1,
      },
    });
    tl.from($(this), {
      "--line-width": "0%",
    });
  });
}

const createScroll01 = () => {
  const panels = Array.from(document.querySelectorAll(".about_why_card-wrap"));

  panels.forEach((panel, index) => {
    const isLast = index === panels.length - 1;

    // Skip animation for the last panel
    if (isLast) return;

    const firstChild = panel.querySelector("div"); // Get the first div inside the panel

    if (!firstChild) return; // Ensure there's a child to animate

    gsap
      .timeline({
        scrollTrigger: {
          trigger: panel, // Use panel as the trigger
          start: "top 25%",
          end: "bottom 10%",
          scrub: true,
          //markers: true
        },
      })
      .to(firstChild, {
        backgroundColor: "#282828",
        scale: 0.95,
        ease: "none",
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  createScroll01();
});

$("[data-accordion-trigger]").on("click", function () {
  let index = $(this).index("[data-accordion-trigger]"); // Get the index within similar elements
  $(".about_aproach_img-wrap").removeClass("is-active");
  $(".about_aproach_img-wrap").eq(index).addClass("is-active");
});

$(".form_input").on("focus", function () {
  $(this).siblings(".form_input-bg").css("opacity", "1");
});

$(".form_input").on("focusout", function () {
  $(this).siblings(".form_input-bg").css("opacity", "0");
});

$(".menu-inner a").on("click", function () {
  $(".menu-button").click();
});

document.addEventListener("DOMContentLoaded", () => {
  tippy("[data-tippy-content]", {
    content: "Tooltip",
  });
});

window.addEventListener("load", function () {
  const footer = document.querySelector(".footer_component");
  if (footer && footer.offsetHeight > window.innerHeight) {
    footer.style.position = "relative";
  }
});
