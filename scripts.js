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

  // Hero Section Animations
  const heroSection = document.querySelector('.hero');
  const heroElements = {
    heading: document.querySelector('.hero-heading'),
    background: document.querySelector('.hero-background'),
    popOut: document.querySelector('.pop-out'),
    secondSection: document.querySelector('.second-section'),
    transitionOverlay: document.querySelector('.transition-overlay')
  };

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 0,
      anticipatePin: 1
    }
  });

  heroTimeline
    .to(heroElements.heading, {
      scale: 3,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(heroElements.background, { opacity: 0, duration: 1 }, 0)
    .to(heroElements.transitionOverlay, {
      backgroundColor: "rgba(26, 26, 26, 1)",
      duration: 1
    }, 0)
    .to(heroElements.popOut, {
      scale: 2,
      y: -100,
      ease: "power2.inOut"
    }, 0);

  // Second Section Animation
  ScrollTrigger.create({
    trigger: heroSection,
    start: "bottom bottom",
    end: "top top",
    onEnter: () => animateSecondSection(),
    onEnterBack: () => animateSecondSection(),
    onLeave: () => resetSecondSection(),
    onLeaveBack: () => resetSecondSection()
  });

  function animateSecondSection() {
    gsap.to(heroElements.secondSection, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power4.out"
    });
  }

  function resetSecondSection() {
    gsap.to(heroElements.secondSection, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in"
    });
  }

  // Card Section Animations
  const cards = gsap.utils.toArray(".card");
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in-view'));
  }, { threshold: 0.5 });

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

    if (!isLastCard) {
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

  // Intro Section Animations
  const introElements = {
    heading: document.querySelector('.intro-heading'),
    text: document.querySelector('.intro-text')
  };

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

  // Outro Section Animations
  const outroElements = {
    heading: document.querySelector('.outro h1'),
    flexItems: document.querySelectorAll('.flex div')
  };

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

  // Contact Section Animations
  const contactElements = {
    heading: document.querySelector('.contact-heading'),
    subheading: document.querySelector('.contact-subheading'),
    formGroups: document.querySelectorAll('.form-group'),
    submitBtn: document.querySelector('.submit-btn')
  };

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

  // Footer Animations
  const footerElements = {
    logo: document.querySelector('.footer-logo'),
    copyright: document.querySelector('.copyright')
  };

  gsap.from(footerElements.logo, {
    duration: 1,
    opacity: 0,
    x: 100,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.footer',
      start: "top center",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from(footerElements.copyright, {
    duration: 1,
    opacity: 0,
    x: 50,
    delay: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.footer',
      start: "top center",
      toggleActions: "play none none reverse"
    }
  });
});


// // Add mobile menu close functionality
// document.querySelectorAll('.nav-links a').forEach(link => {
//   link.addEventListener('click', () => {
//     document.querySelector('.menu-toggle').classList.remove('active');
//     document.querySelector('.nav-links').classList.remove('active');
//   });
// });

// // Optimize animations for mobile
// ScrollTrigger.matchMedia({
//   "(max-width: 768px)": function() {
//     ScrollTrigger.defaults({
//       toggleActions: "play none none none",
//       scrub: false
//     });
//   }
// });