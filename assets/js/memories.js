/* ==========================================================================
   Memory Lane — full-size photo viewer
   Every <button class="shot"> with an <img> opens here. Browse with the
   arrow buttons, the keyboard (← → Esc), or a swipe on phones.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector("[data-memory-lightbox]");
  const shots = [...document.querySelectorAll("button.shot")].filter(s => s.querySelector("img"));
  if (!box || !shots.length) return;

  const img = box.querySelector(".mlb-stage img");
  const cap = box.querySelector("[data-mlb-caption]");
  const count = box.querySelector("[data-mlb-count]");
  let index = 0, lastFocus = null;

  function show(i){
    index = (i + shots.length) % shots.length;
    const shot = shots[index];
    const thumb = shot.querySelector("img");
    const chapter = shot.closest("[data-chapter]");
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    cap.textContent = shot.getAttribute("data-caption") || thumb.alt;
    count.textContent = (chapter ? chapter.getAttribute("data-chapter") + " · " : "") + (index + 1) + " of " + shots.length;
  }
  function open(i){
    lastFocus = document.activeElement;
    show(i);
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    box.querySelector(".mlb-close").focus();
  }
  function close(){
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  shots.forEach((shot, i) => shot.addEventListener("click", () => open(i)));
  box.querySelector(".mlb-close").addEventListener("click", close);
  box.querySelector(".mlb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".mlb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("mlb-stage")) close(); });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
});
