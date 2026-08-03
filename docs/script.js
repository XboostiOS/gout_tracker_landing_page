/* =================================================================
   Goutly — vanilla JS. No dependencies, no external requests.
   Progressive enhancement only: the page is fully usable with JS off.
   ================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Nav: add hairline once the page is scrolled --- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Signature hero chart: play the draw animation once visible --- */
  var chartCard = document.querySelector(".mock__chartcard");
  function playChart() {
    if (chartCard) chartCard.classList.add("is-ready");
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    playChart();
  } else if (chartCard) {
    var chartObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { playChart(); obs.disconnect(); }
      });
    }, { threshold: 0.35 });
    chartObs.observe(chartCard);
  }

  /* --- Scroll reveal for sections --- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { revealObs.observe(el); });
  }

  /* --- FAQ: keep it a single-open accordion (native <details>) --- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".faq .qa"));
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
