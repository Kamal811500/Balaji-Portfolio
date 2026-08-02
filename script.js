'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL & MOBILE TOGGLE ---- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ---- REVEAL ANIMATIONS (data-reveal) ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.revealDelay || 0) * 1000;
        setTimeout(() => el.classList.add('revealed'), delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ---- SKILL BARS ---- */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, index) => {
          setTimeout(() => bar.classList.add('go'), index * 120);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillSec = document.getElementById('skills');
  if (skillSec) skillObs.observe(skillSec);

  /* ---- COUNT UP ANIMATION ---- */
  function countUp(el, target, suffix = '') {
    const start = performance.now();
    const duration = 1600;
    (function run(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(run);
      } else {
        el.textContent = target + suffix;
      }
    })(performance.now());
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const targetNum = parseInt(el.dataset.count, 10);
          countUp(el, targetNum, '+');
        });
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutSec = document.getElementById('about');
  if (aboutSec) statsObs.observe(aboutSec);

  /* ---- PROJECT FILTERS ---- */
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.f;

      document.querySelectorAll('.proj-item').forEach(card => {
        const matches = filter === 'all' || card.dataset.cat === filter;
        card.style.opacity = matches ? '1' : '0.15';
        card.style.transform = matches ? 'scale(1)' : 'scale(0.96)';
        card.style.pointerEvents = matches ? 'auto' : 'none';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      });
    });
  });

  /* ---- SERVICE CARD TILT EFFECT ---- */
  document.querySelectorAll('.srv-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      this.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -6}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  /* ---- SECURE BASE64 EMAIL OBFUSCATION ---- */
  const decodeMail = (el) => {
    const u = el.dataset.u;
    const d = el.dataset.d;
    if (u && d) {
      return `${atob(u)}@${atob(d)}`;
    }
    return '';
  };

  document.querySelectorAll('.secure-email-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = decodeMail(link);
      if (email) {
        const mailAnchor = document.createElement('a');
        mailAnchor.href = `mailto:${email}`;
        mailAnchor.style.display = 'none';
        document.body.appendChild(mailAnchor);
        mailAnchor.click();
        document.body.removeChild(mailAnchor);
      }
    });
  });

  document.querySelectorAll('.obfuscate-text').forEach(target => {
    const reveal = function() {
      const email = decodeMail(target);
      if (email) {
        target.textContent = email;
        target.style.cursor = 'default';
      }
    };

    target.addEventListener('click', function(e) {
      e.stopPropagation();
      reveal();
    });
    target.addEventListener('mouseover', reveal);
    target.addEventListener('focus', reveal);
  });

  /* ---- ACCESSIBLE FLIP CARDS ---- */
  document.querySelectorAll('.fc').forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.classList.toggle('flipped');
      }
    });
  });

  /* ---- CONTACT FORM HANDLER ---- */
  const contactForm = document.getElementById('cform');
  const formSuccess = document.getElementById('form-ok');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const subject = document.getElementById('form-subject')?.value || 'Portfolio Contact Inquiry';
      const message = document.getElementById('form-message')?.value || '';

      // Construct mailto link for direct user connection
      const bodyText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:balaji2909.s@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      // Show success message
      if (formSuccess) {
        formSuccess.style.display = 'block';
        // Auto-resolve any nested obfuscate texts inside success alerts
        formSuccess.querySelectorAll('.obfuscate-text').forEach(target => {
          const u = target.dataset.user;
          const d = target.dataset.domain;
          if (u && d) target.textContent = `${u}@${d}`;
        });
      }

      // Safe clean window trigger
      const mailAnchor = document.createElement('a');
      mailAnchor.href = mailtoUrl;
      mailAnchor.style.display = 'none';
      document.body.appendChild(mailAnchor);
      mailAnchor.click();
      document.body.removeChild(mailAnchor);

      // Reset form fields
      contactForm.reset();
    });
  }

});
