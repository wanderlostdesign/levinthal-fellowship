// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
}

// Fade sections in as they scroll into view
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Hide anything tagged with data-expires once that date has passed
const now = new Date();
document.querySelectorAll("[data-expires]").forEach((el) => {
  if (now > new Date(el.dataset.expires)) el.remove();
});

// Year in footer
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = now.getFullYear();
});

// Respect reduced-motion: keep background video on its poster frame
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach((v) => {
    v.removeAttribute("autoplay");
    v.pause();
  });
}

// Photo carousel: arrows, dots, keyboard, and swipe (via scroll-snap)
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...track.querySelectorAll(".slide")];
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  const dots = [...carousel.querySelectorAll(".carousel-dots button")];
  const caption = carousel.querySelector(".carousel-caption");
  const index = carousel.querySelector(".carousel-index");
  let current = 0;

  const show = (i) => {
    current = i;
    dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    caption.textContent = slides[i].querySelector("figcaption").textContent;
    index.textContent = i + 1;
  };

  const goTo = (i) => {
    i = (i + slides.length) % slides.length; // wrap around at either end
    show(i); // update right away so rapid clicks keep advancing
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
  });

  // Swipes and trackpad scrolls: sync once the scroll settles
  let settle;
  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => show(Math.round(track.scrollLeft / track.clientWidth)), 120);
  });
  window.addEventListener("resize", () => goTo(current));
});
