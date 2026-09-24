/* ==========================================================================
   Bishop McAllister College Kyogyera — shared site behaviour
   Front-end only: no server, no database. The contact/admissions "forms"
   compose an email in the visitor's own mail app via a mailto: link.
   ========================================================================== */

/* ---- 1. SCHOOL CONFIG ---------------------------------------------------
   Edit these once and every page picks them up automatically.
   Replace the bracketed placeholders with the school's real details. */
window.BMCK = {
  name: "Bishop McAllister College Kyogyera",
  shortName: "BMCK",
  motto: "Soaring to Great Heights",
  admissionsEmail: "admissions@bmck-kyogyera.example", // TODO: replace with the real admissions email
  generalEmail: "info@bmck-kyogyera.example",          // TODO: replace with the real office email
  phone: "+256 780 623329", // Head Teacher / school line; Deputy: +256 702 481663
  address: "Kyogyera, Ankole Sub-region, Western Uganda", // TODO: add full P.O. Box / physical address
  facebook: "https://www.facebook.com/bishopmcallister/",
  mapsQuery: "https://www.google.com/maps/search/?api=1&query=Bishop+McAllister+College+Kyogyera+Uganda"
};

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initHeaderScroll();
  initMobileNav();
  initActiveNav();
  initReveal();
  initCounters();
  initCarousel();
  initAccordion();
  initGalleryFilter();
  initLightbox();
  initBackToTop();
  initMailtoForms();
  hydrateConfig();
});

/* ---- year in footer ---- */
function setYear(){
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---- fill in shared contact/config values wherever referenced ---- */
function hydrateConfig(){
  const cfg = window.BMCK;
  document.querySelectorAll("[data-cfg]").forEach(el => {
    const key = el.getAttribute("data-cfg");
    const val = cfg[key];
    if (!val) return; // leave the on-page placeholder text as-is
    if (el.tagName === "A") {
      if (key === "admissionsEmail" || key === "generalEmail") el.href = "mailto:" + val;
      if (key === "phone") el.href = "tel:" + val.replace(/\s+/g, "");
      if (key === "facebook" || key === "mapsQuery") { el.href = val; return; } // keep the link's own label
    }
    el.textContent = val;
  });
}

/* ---- sticky header shadow on scroll ---- */
function initHeaderScroll(){
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- mobile nav drawer ---- */
function initMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

/* ---- highlight current page in nav ---- */
function initActiveNav(){
  const here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[href]").forEach(a => {
    const href = a.getAttribute("href").split("/").pop();
    if (href === here || (here === "" && href === "index.html")) a.classList.add("active");
  });
}

/* ---- reveal-on-scroll ---- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
}

/* ---- animated stat counters ----
   The numbers count up every time the strip scrolls into view, and reset
   when it leaves, so coming back replays it like the first visit. */
function initCounters(){
  const stats = document.querySelectorAll("[data-count]");
  if (!stats.length) return;
  const format = (el, val) =>
    (el.hasAttribute("data-plain") ? String(val) : val.toLocaleString()) + (el.getAttribute("data-suffix") || ""); // years: no comma
  const animate = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const duration = 1400;
    const start = performance.now();
    const run = ++el._run || (el._run = 1); // a newer run cancels an older one
    const step = (now) => {
      if (el._run !== run) return;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(el, Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const reset = (el) => { el._run = (el._run || 0) + 1; el.textContent = format(el, 0); };
  if (!("IntersectionObserver" in window)) { stats.forEach(animate); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.isIntersecting ? animate(entry.target) : reset(entry.target));
  }, { threshold: 0.6 });
  stats.forEach(el => io.observe(el));

  // replay the cards' staggered rise too
  const strips = document.querySelectorAll(".stat-strip");
  const so = new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting));
  }, { threshold: 0.2 });
  strips.forEach(el => so.observe(el));
}

/* ---- quote / testimonial carousel ---- */
function initCarousel(){
  const track = document.querySelector("[data-carousel]");
  if (!track) return;
  const slides = [...track.querySelectorAll(".quote-slide")];
  const dotsWrap = document.querySelector("[data-carousel-dots]");
  if (!slides.length) return;
  let index = 0, timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => go(i));
    dotsWrap && dotsWrap.appendChild(dot);
  });

  function go(i){
    slides[index].classList.remove("is-active");
    dotsWrap && dotsWrap.children[index].classList.remove("is-active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    dotsWrap && dotsWrap.children[index].classList.add("is-active");
    restart();
  }
  function restart(){
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 6500);
  }
  restart();
}

/* ---- FAQ accordion ---- */
function initAccordion(){
  document.querySelectorAll(".acc-item").forEach(item => {
    const trigger = item.querySelector(".acc-trigger");
    const panel = item.querySelector(".acc-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      item.closest(".accordion").querySelectorAll(".acc-item.is-open").forEach(open => {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".acc-panel").style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
    });
  });
}

/* ---- gallery category filter ---- */
function initGalleryFilter(){
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!buttons.length || !items.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.getAttribute("data-filter");
      items.forEach(item => {
        const show = cat === "all" || item.getAttribute("data-category") === cat;
        item.classList.toggle("is-visible", show);
      });
    });
  });
}

/* ---- lightbox for gallery tiles ---- */
function initLightbox(){
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;
  const stage = lightbox.querySelector("[data-lightbox-stage]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll(".ph-photo[data-caption]").forEach(tile => {
    tile.addEventListener("click", () => {
      const isReal = tile.classList.contains("is-real");
      stage.className = "ph-photo" + (isReal ? " is-real" : "");
      if (isReal) {
        stage.style.backgroundImage = tile.style.backgroundImage;
        stage.innerHTML = "";
      } else {
        stage.style.backgroundImage = "";
        stage.style.setProperty("--hue", getComputedStyle(tile).getPropertyValue("--hue"));
        stage.innerHTML = tile.querySelector(".ph-icon").outerHTML;
      }
      caption.textContent = tile.getAttribute("data-caption");
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });
  const close = () => { lightbox.classList.remove("is-open"); document.body.style.overflow = ""; };
  closeBtn && closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ---- back-to-top button ---- */
function initBackToTop(){
  const btn = document.querySelector(".to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---- inquiry / contact forms: build a mailto: draft, no backend involved ---- */
function initMailtoForms(){
  document.querySelectorAll("form[data-mailto]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = form.getAttribute("data-mailto") === "admissions"
        ? window.BMCK.admissionsEmail
        : window.BMCK.generalEmail;
      const data = new FormData(form);
      const lines = [];
      data.forEach((value, key) => { if (value) lines.push(`${labelFor(form, key)}: ${value}`); });
      const subject = encodeURIComponent(form.getAttribute("data-subject") || `Website inquiry from ${data.get("name") || "a visitor"}`);
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      const success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
      form.reset();
    });
  });
}
function labelFor(form, key){
  const field = form.querySelector(`[name="${key}"]`);
  const label = field && field.closest(".field") && field.closest(".field").querySelector("label");
  return label ? label.textContent.replace("*", "").trim() : key;
}
