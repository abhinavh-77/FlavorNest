/* =========================================================
   FoodieHub — script.js
   Modular vanilla JS. Sections:
   1. Preloader
   2. Sticky navbar + scroll progress
   3. Mobile hamburger menu
   4. Smooth scrolling + active nav highlighting
   5. Scroll-triggered fade-in animations
   6. Experience counter
   7. Cart counter (Add to Cart)
   8. Toast notifications
   9. Testimonials slider
   10. Scroll-to-top button
   11. Contact form validation
   12. Footer year
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hide');
    }, 400);
  });

  /* ---------- 2. Sticky navbar + scroll progress ---------- */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');

  function handleScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky navbar
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects();

  /* ---------- 3. Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close menu when a link is clicked (mobile UX)
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. Smooth scrolling + active nav highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 140;
    let currentId = sections.length ? sections[0].id : '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  window.addEventListener('scroll', highlightActiveNav);
  highlightActiveNav();

  /* ---------- 5. Scroll-triggered fade-in animations ---------- */
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(function (el) { observer.observe(el); });

  // Hero elements should animate immediately on load, not on scroll
  document.querySelectorAll('.hero-content .fade-in-up').forEach(function (el) {
    setTimeout(function () { el.classList.add('visible'); }, 100);
  });

  /* ---------- 6. Experience counter ---------- */
  const expCounter = document.getElementById('expCounter');
  let counterStarted = false;

  function animateCounter(target, endValue, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      target.textContent = Math.floor(progress * endValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        target.textContent = endValue;
      }
    }
    requestAnimationFrame(step);
  }

  if (expCounter) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterStarted) {
          counterStarted = true;
          animateCounter(expCounter, 12, 1500);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(expCounter);
  }

  /* ---------- 7. Cart counter (Add to Cart) ---------- */
  const cartCountEl = document.getElementById('cartCount');
  let cartCount = 0;

  document.querySelectorAll('.btn-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cartCount += 1;
      cartCountEl.textContent = cartCount;

      const foodName = btn.dataset.name || 'Item';
      showToast(foodName + ' added to cart 🛒');

      // Small visual feedback on the button itself
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      setTimeout(function () {
        btn.textContent = originalText;
        btn.classList.remove('added');
      }, 1200);

      // Bounce animation on cart icon
      const cartBtn = document.querySelector('.cart-btn');
      cartBtn.style.transform = 'scale(1.25)';
      setTimeout(function () { cartBtn.style.transform = 'scale(1)'; }, 200);
    });
  });

  /* ---------- 8. Toast notifications ---------- */
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  /* ---------- 9. Scroll-to-top button ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 10. Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    phone: { el: document.getElementById('phone'), error: document.getElementById('phoneError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let isValid = true;
    let message = '';

    if (value === '') {
      isValid = false;
      message = 'This field is required.';
    } else if (key === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (key === 'phone') {
      const phonePattern = /^[+]?[\d\s()-]{7,}$/;
      if (!phonePattern.test(value)) {
        isValid = false;
        message = 'Please enter a valid phone number.';
      }
    } else if (key === 'name' && value.length < 2) {
      isValid = false;
      message = 'Name must be at least 2 characters.';
    } else if (key === 'message' && value.length < 10) {
      isValid = false;
      message = 'Message must be at least 10 characters.';
    }

    el.classList.toggle('invalid', !isValid);
    error.textContent = isValid ? '' : message;
    return isValid;
  }

  if (contactForm) {
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', function () { validateField(key); });
      fields[key].el.addEventListener('input', function () {
        if (fields[key].el.classList.contains('invalid')) validateField(key);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let allValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) allValid = false;
      });

      if (allValid) {
        formSuccess.classList.add('show');
        showToast('Message sent successfully! 🎉');
        contactForm.reset();
        setTimeout(function () { formSuccess.classList.remove('show'); }, 5000);
      } else {
        formSuccess.classList.remove('show');
      }
    });
  }

  /* ---------- 12. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
