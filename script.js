document.addEventListener('DOMContentLoaded', function() {
  // Register plugins and setup smooth scrolling
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  // Lenis-GSAP integration
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Define section background colors (adjust these to your preference)
  const sectionColors = {
    hero: { background: "#1a1a1a" },
    secondSection: { background: "#2C6737" },
    intro: { background: "#0a0a0a" },
    cards: { background: "#1e1e1e" },
    outro: { background: "#2C6737" },
    contact: { background: "#0a0a0a" },
    footer: { background: "#1a1a1a" }
  };

  // Apply initial body background color
  gsap.set('body', { backgroundColor: sectionColors.hero.background });

  // Background color transition function
  function createBackgroundTransition(triggerElement, color, startPosition = "top center") {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: startPosition,
      onEnter: () => {
        gsap.to('body', {
          backgroundColor: color,
          duration: 1.2,
          ease: "power2.inOut"
        });
      },
      onLeaveBack: () => {
        const prevSection = triggerElement.previousElementSibling;
        if (prevSection) {
          const prevSectionName = Array.from(prevSection.classList)[0];
          const prevColor = sectionColors[prevSectionName]?.background || "#1a1a1a";
          gsap.to('body', {
            backgroundColor: prevColor,
            duration: 1.2,
            ease: "power2.inOut"
          });
        }
      }
    });
  }

  // Create background transitions for each section
  createBackgroundTransition(document.querySelector('.second-section'), sectionColors.secondSection.background);
  createBackgroundTransition(document.querySelector('.intro'), sectionColors.intro.background);
  createBackgroundTransition(document.querySelector('.cards'), sectionColors.cards.background);
  createBackgroundTransition(document.querySelector('.outro'), sectionColors.outro.background);
  createBackgroundTransition(document.querySelector('.contact'), sectionColors.contact.background);
  createBackgroundTransition(document.querySelector('.footer'), sectionColors.footer.background);

  // Hero Section Animations
  const heroSection = document.querySelector('.hero');
  const heroElements = {
    heading: document.querySelector('.hero-heading'),
    headingAlt: document.querySelector('.hero-heading-alt'),
    background: document.querySelector('.hero-background'),
    transitionOverlay: document.querySelector('.transition-overlay'),
    secondSection: document.querySelector('.second-section')
  };

  // Set initial states
  gsap.set(heroElements.heading, { scale: 1, opacity: 1 });
  gsap.set(heroElements.secondSection, { opacity: 0 });

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 0.5,
      anticipatePin: 1
    }
  });

  // Animation sequence
  heroTimeline
    // Zoom out the hero image
    .to(heroElements.heading, {
      scale: 10,
      opacity: 0,
      duration: 1.5,
      ease: "power4.in"
    })
    // Transition to white screen
    .to(heroElements.transitionOverlay, {
      backgroundColor: "#ffffff",
      duration: 1,
      ease: "power2.inOut"
    })
    // Show the next sections
    .to(heroElements.secondSection, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, "+=0.5");

  // Add letter animation to nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const text = link.textContent;
    link.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.3s ease';
      link.appendChild(span);
    }
    
    link.addEventListener('mouseenter', () => {
      const letters = link.querySelectorAll('span');
      letters.forEach((letter, index) => {
        gsap.to(letter, {
          y: -10,
          duration: 0.4,
          ease: "power2.out",
          delay: index * 0.03,
          yoyo: true,
          repeat: 1
        });
      });
    });
  });

  // Card Section Animations with background color transitions
  const cards = gsap.utils.toArray(".card");
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.5 });

  if (cards.length > 0) {
    ScrollTrigger.create({
      trigger: cards[0],
      start: "top 35%",
      endTrigger: cards[cards.length - 1],
      end: "top 30%",
      pin: ".intro",
      pinSpacing: false,
    });

    cards.forEach((card, index) => {
      cardObserver.observe(card);
      const isLastCard = index === cards.length - 1;
      const cardInner = card.querySelector(".card-inner");

      if (!isLastCard && cardInner) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 35%",
          endTrigger: ".outro",
          end: "top 65%",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(cardInner, {
          y: `-${(cards.length - index) * 14}vh`,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 35%",
            endTrigger: ".outro",
            end: "top 65%",
            scrub: true,
          }
        });
      }
    });
  }

  // Intro Section Animations
  const introElements = {
    heading: document.querySelector('.intro-heading'),
    text: document.querySelector('.intro-text')
  };

  if (introElements.heading) {
    gsap.to(introElements.heading, {
      duration: 1.5,
      opacity: 1,
      y: 0,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.intro',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(introElements.heading, {
      duration: 1.8,
      letterSpacing: "20px",
      ease: "expo.out",
      scrollTrigger: {
        trigger: '.intro',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (introElements.text) {
    gsap.to(introElements.text, {
      duration: 1.2,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      delay: 0.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.intro',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Outro Section Animations
  const outroElements = {
    heading: document.querySelector('.outro h1'),
    flexItems: document.querySelectorAll('.flex div')
  };

  if (outroElements.heading) {
    gsap.from(outroElements.heading, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.outro',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (outroElements.flexItems && outroElements.flexItems.length > 0) {
    gsap.from(outroElements.flexItems, {
      duration: 1,
      opacity: 0,
      y: 50,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.flex',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Contact Section Animations
  const contactElements = {
    heading: document.querySelector('.contact-heading'),
    subheading: document.querySelector('.contact-subheading'),
    formGroups: document.querySelectorAll('.form-group'),
    submitBtn: document.querySelector('.submit-btn')
  };

  if (contactElements.heading) {
    gsap.from(contactElements.heading, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.contact',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (contactElements.subheading) {
    gsap.from(contactElements.subheading, {
      duration: 1,
      opacity: 0,
      y: 30,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.contact',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (contactElements.formGroups && contactElements.formGroups.length > 0) {
    gsap.from(contactElements.formGroups, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (contactElements.submitBtn) {
    gsap.from(contactElements.submitBtn, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Add a creative text effect to the footer
  const footerElements = {
    logo: document.querySelector('.footer-logo'),
    copyright: document.querySelector('.copyright')
  };

  if (footerElements.logo) {
    // Split the logo text into characters
    const logoText = footerElements.logo.textContent;
    footerElements.logo.innerHTML = '';
    
    for (let i = 0; i < logoText.length; i++) {
      const span = document.createElement('span');
      span.textContent = logoText[i];
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(50px) rotate(10deg)';
      footerElements.logo.appendChild(span);
    }
    
    // Animate each character
    const logoChars = footerElements.logo.querySelectorAll('span');
    gsap.to(logoChars, {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.footer',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
    
    // Add hover effect
    footerElements.logo.addEventListener("mouseenter", () => {
      gsap.to(logoChars, {
        y: -10,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.out"
      });
    });
    
    footerElements.logo.addEventListener("mouseleave", () => {
      gsap.to(logoChars, {
        y: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out"
      });
    });
  }

  if (footerElements.copyright) {
    gsap.from(footerElements.copyright, {
      duration: 1,
      opacity: 0,
      y: 20,
      delay: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.footer',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }
});