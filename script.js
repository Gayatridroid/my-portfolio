/* ==========================================================================
   UPTOSKILL PORTFOLIO — script.js
   Author: Gayatri Katole
   Sections:
     1. Loading Screen
     2. Mouse Glow Effect
     3. Navbar Scroll + Active Link
     4. Hamburger Menu
     5. Typing Animation
     6. Scroll Reveal (IntersectionObserver)
     7. Animated Counters
     8. Skill Bar Animation
     9. Contact Form Handling
     10. Back To Top Button
     11. Footer Year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------- */
  /* 1. LOADING SCREEN                                                 */
  /* ---------------------------------------------------------------- */
  const loadingScreen = document.getElementById('loading-screen');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 500);
  });

  // Fallback: hide loader even if 'load' fires late / assets fail
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
    }
  }, 3000);

  /* ---------------------------------------------------------------- */
  /* 2. MOUSE GLOW EFFECT (desktop only, respects reduced motion)      */
  /* ---------------------------------------------------------------- */
  const mouseGlow = document.getElementById('mouseGlow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (mouseGlow && !prefersReducedMotion && !isTouchDevice) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      mouseGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  } else if (mouseGlow) {
    mouseGlow.style.display = 'none';
  }

  /* ---------------------------------------------------------------- */
  /* 3. NAVBAR SCROLL STATE + ACTIVE LINK ON SCROLL                    */
  /* ---------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function handleActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-link');
      }
    });
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        handleActiveLink();
        toggleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  handleNavbarScroll();
  handleActiveLink();

  /* ---------------------------------------------------------------- */
  /* 3.1 TOUCH SWIPE NAVIGATION                                        */
  /* ---------------------------------------------------------------- */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  function getCurrentSectionId() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0] ? sections[0].getAttribute('id') : null;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    return current;
  }

  function goToNextSection() {
    const currentId = getCurrentSectionId();
    const sectionIds = Array.from(sections).map((section) => section.getAttribute('id'));
    const currentIndex = sectionIds.indexOf(currentId);

    if (currentIndex >= 0 && currentIndex < sectionIds.length - 1) {
      const nextSection = document.getElementById(sectionIds[currentIndex + 1]);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function goToPreviousSection() {
    const currentId = getCurrentSectionId();
    const sectionIds = Array.from(sections).map((section) => section.getAttribute('id'));
    const currentIndex = sectionIds.indexOf(currentId);

    if (currentIndex > 0) {
      const prevSection = document.getElementById(sectionIds[currentIndex - 1]);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = event.timeStamp;
  }

  function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = event.timeStamp - touchStartTime;

    const isHorizontalSwipe = Math.abs(deltaX) > 60 && Math.abs(deltaY) < 80 && deltaTime < 500;

    if (isHorizontalSwipe) {
      if (deltaX < 0) {
        goToNextSection();
      } else if (deltaX > 0) {
        goToPreviousSection();
      }
    }
  }

  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });

  const swipeHint = document.querySelector('.swipe-hint');
  if (swipeHint && !prefersReducedMotion && isTouchDevice) {
    setTimeout(() => swipeHint.classList.add('show'), 600);
    setTimeout(() => swipeHint.classList.remove('show'), 5200);
  }

  /* ---------------------------------------------------------------- */
  /* 4. HAMBURGER MENU                                                 */
  /* ---------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', toggleMenu);

    navLinkEls.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------------- */
  /* 5. TYPING ANIMATION                                               */
  /* ---------------------------------------------------------------- */
  const typingEl = document.getElementById('typing-text');
  const typingWords = ['AI Enthusiast', 'UI/UX Designer', 'Frontend Developer', 'Python Learner'];

  if (typingEl) {
    if (prefersReducedMotion) {
      typingEl.textContent = typingWords[0];
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function typeLoop() {
        const currentWord = typingWords[wordIndex];

        if (isDeleting) {
          charIndex--;
        } else {
          charIndex++;
        }

        typingEl.textContent = currentWord.substring(0, charIndex);

        let delay = isDeleting ? 45 : 95;

        if (!isDeleting && charIndex === currentWord.length) {
          delay = 1400;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % typingWords.length;
          delay = 300;
        }

        setTimeout(typeLoop, delay);
      }

      typeLoop();
    }
  }

  /* ---------------------------------------------------------------- */
  /* 6. SCROLL REVEAL (IntersectionObserver)                           */
  /* ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!('IntersectionObserver' in window)) {
    // Graceful fallback for unsupported browsers: show content immediately
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------- */
  /* 7. ANIMATED COUNTERS                                              */
  /* ---------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const noIncrement = el.getAttribute('data-noincrement') === 'true';

    if (noIncrement || prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(eased * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  /* ---------------------------------------------------------------- */
  /* 8. SKILL BAR ANIMATION                                            */
  /* ---------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width') || '0';
          requestAnimationFrame(() => {
            bar.style.width = width + '%';
          });
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ---------------------------------------------------------------- */
  /* 9. CONTACT FORM HANDLING (client-side only demo)                  */
  /* ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formBtnText = document.getElementById('formBtnText');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all fields before sending.';
        formStatus.style.color = '#FF6B4A';
        return;
      }

      if (!emailPattern.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.style.color = '#FF6B4A';
        return;
      }

      // Simulate sending — replace with real backend / form service (e.g. Formspree) in production
      formBtnText.textContent = 'Sending...';

      setTimeout(() => {
        formStatus.textContent = `Thanks, ${name}! Your message has been received. I'll get back to you soon.`;
        formStatus.style.color = '#FF6B4A';
        formBtnText.textContent = 'Send Message';
        contactForm.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------------- */
  /* 10. BACK TO TOP BUTTON                                            */
  /* ---------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------- */
  /* 11. FOOTER YEAR                                                   */
  /* ---------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
