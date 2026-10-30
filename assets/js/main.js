/**
 * Aapulki Pune Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Copy Bank Details to Clipboard
  window.copyText = function(text, btnElement) {
    if (!navigator.clipboard) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showCopiedFeedback(btnElement);
      } catch (err) {
        console.error('Copy failed', err);
      }
      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showCopiedFeedback(btnElement);
    }).catch(err => {
      console.error('Failed to copy', err);
    });
  };

  function showCopiedFeedback(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Copied! ✓';
    btn.style.backgroundColor = '#27AE60';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 2000);
  }

  // 3. Dynamic Navbar Scrollspy (IntersectionObserver + Scroll Position Fallback)
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const header = document.querySelector('.site-header');

  function setActiveNavLink(id) {
    if (!id) return;
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Accurate scroll calculation that handles clicks, fast-scroll, and section transitions
  function updateScrollspy() {
    const scrollPosition = window.scrollY + 140; // Header offset buffer
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if reached bottom of page -> activate last section ('contact')
    if (window.scrollY + windowHeight >= documentHeight - 60) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        setActiveNavLink(lastSection.id);
        return;
      }
    }

    // Top of page -> activate first section ('home')
    if (window.scrollY < 120) {
      if (sections[0]) {
        setActiveNavLink(sections[0].id);
        return;
      }
    }

    // Determine currently active section based on top offset
    let currentActiveId = '';
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActiveId = section.id;
        break;
      }
    }

    if (currentActiveId) {
      setActiveNavLink(currentActiveId);
    }
  }

  // Throttled scroll listener with requestAnimationFrame
  let isTicking = false;
  window.addEventListener('scroll', () => {
    // Dynamic Header Elevation
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateScrollspy();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Initial call on load
  updateScrollspy();

  // Smooth click scroll to account for fixed header offset
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 80;
          const targetY = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
          setActiveNavLink(href.substring(1));
        }
      }
    });
  });

  // 5. About Section Showcase Switcher
  const dockBtns = document.querySelectorAll('.dock-thumb-btn');
  const slides = document.querySelectorAll('.stage-slide');

  if (dockBtns.length > 0 && slides.length > 0) {
    function switchSlide(targetId) {
      slides.forEach(slide => {
        if (slide.id === targetId) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      dockBtns.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    dockBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        switchSlide(targetId);
      });
    });

    // Auto rotate every 6 seconds if not hovered
    let currentSlideIdx = 0;
    const slideIds = ['slide-1', 'slide-2'];
    let autoRotate = setInterval(() => {
      currentSlideIdx = (currentSlideIdx + 1) % slideIds.length;
      switchSlide(slideIds[currentSlideIdx]);
    }, 6000);

    const showcaseEl = document.querySelector('.story-showcase');
    if (showcaseEl) {
      showcaseEl.addEventListener('mouseenter', () => clearInterval(autoRotate));
      showcaseEl.addEventListener('mouseleave', () => {
        clearInterval(autoRotate);
        autoRotate = setInterval(() => {
          currentSlideIdx = (currentSlideIdx + 1) % slideIds.length;
          switchSlide(slideIds[currentSlideIdx]);
        }, 6000);
      });
    }
  }
});

