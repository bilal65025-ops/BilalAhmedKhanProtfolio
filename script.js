(function(){
  "use strict";

  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var STORAGE_KEY = "bak-portfolio-theme";

  function applyTheme(theme){
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e){}
  }

  (function initTheme(){
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e){}
    if (saved){
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
      applyTheme("dark");
    }
  })();

  if (themeToggle){
    themeToggle.addEventListener("click", function(){
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav){
    menuToggle.addEventListener("click", function(){
      var isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll(".nav-link").forEach(function(link){
      link.addEventListener("click", function(){
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll-spy active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks
    .map(function(link){ return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function updateActiveNav(){
    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function(section){
      if (section.offsetTop <= scrollPos) current = section;
    });
    navLinks.forEach(function(link){
      var target = document.querySelector(link.getAttribute("href"));
      link.classList.toggle("active", target === current);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Typing effect in hero ---------- */
  var typedEl = document.getElementById("typed-role");
  var roles = [
    "Administrative Support — State Bank of Pakistan",
    "BBA (Hons) Candidate, Iqra University",
    "Corporate Services & Strategic Planning"
  ];

  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    var roleIndex = 0, charIndex = 0, deleting = false;

    function typeTick(){
      var current = roles[roleIndex];
      if (!deleting){
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length){
          deleting = true;
          setTimeout(typeTick, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0){
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeTick, deleting ? 28 : 42);
    }
    typeTick();
  } else if (typedEl){
    typedEl.textContent = roles[0];
  }

  /* ---------- Animate skill bars when visible ---------- */
  var skillRows = document.querySelectorAll(".skill-row");
  if ("IntersectionObserver" in window && skillRows.length){
    var skillObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var row = entry.target;
          var level = row.getAttribute("data-level") || "0";
          var fill = row.querySelector(".skill-fill");
          if (fill) fill.style.width = level + "%";
          skillObserver.unobserve(row);
        }
      });
    }, { threshold: 0.4 });
    skillRows.forEach(function(row){ skillObserver.observe(row); });
  } else {
    skillRows.forEach(function(row){
      var fill = row.querySelector(".skill-fill");
      if (fill) fill.style.width = (row.getAttribute("data-level") || "0") + "%";
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  function setError(fieldId, message){
    var field = document.getElementById(fieldId);
    var errorEl = document.querySelector('[data-error-for="' + fieldId + '"]');
    var row = field ? field.closest(".form-row") : null;
    if (errorEl) errorEl.textContent = message || "";
    if (row) row.classList.toggle("has-error", !!message);
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("f-name");
      var email = document.getElementById("f-email");
      var message = document.getElementById("f-message");
      var valid = true;

      if (!name.value.trim()){
        setError("f-name", "Please enter your name.");
        valid = false;
      } else { setError("f-name", ""); }

      if (!email.value.trim() || !isValidEmail(email.value.trim())){
        setError("f-email", "Please enter a valid email address.");
        valid = false;
      } else { setError("f-email", ""); }

      if (!message.value.trim() || message.value.trim().length < 10){
        setError("f-message", "Message should be at least 10 characters.");
        valid = false;
      } else { setError("f-message", ""); }

      if (!valid){
        status.textContent = "";
        return;
      }

      status.textContent = "Thanks, " + name.value.trim().split(" ")[0] + " — your message details are ready. Connect a form backend (e.g. Formspree) to send this live.";
      form.reset();
    });
  }

  /* ---------- Back to top visibility ---------- */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop){
    function toggleBackToTop(){
      backToTop.style.opacity = window.scrollY > 500 ? "1" : "0.35";
    }
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

})();
