(() => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  };

  if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = Number(entry.target.dataset.delay || 0);
          window.setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  let scrollTicking = false;

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;
    header?.classList.toggle("scrolled", scrollY > 24);

    if (!reduceMotion) {
      const heroOffset = Math.min(scrollY * 0.085, 74);
      document.documentElement.style.setProperty("--hero-scroll", `${heroOffset}px`);
    }

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollEffects);
    },
    { passive: true },
  );

  window.addEventListener("pageshow", () => {
    if (window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" });
    }
  });

  updateScrollEffects();
})();


/* ---- i18n PT/EN toggle ---- */
(() => {
  const I18N = {"nav.platform": "Platform", "nav.business": "For business", "nav.safety": "Safety", "nav.experience": "Experience", "nav.cta": "Partner with us", "hero.title": "Performance, safety and management for those who <em>move the paddle.</em>", "hero.lead": "A digital platform for clubs, teams and athletes who want to turn every stroke into a smarter experience.", "hero.cta1": "Introduce my company <span>↗</span>", "hero.cta2": "Explore the platform <span>↗</span>", "hero.m1": "prototyped flows", "hero.m2": "bilingual experience", "hero.m3": "Va'a and Outrigger", "hero.chip1": "82% ready to row", "hero.chip2": "<i></i> Live data", "hero.scroll": "<span></span>Scroll to explore", "strip.clubs": "Clubs", "strip.teams": "Teams", "strip.athletes": "Athletes", "strip.brands": "Brands", "vision.eyebrow": "A new layer for paddling", "vision.h2": "The sea changes constantly.<br><em>So does the operation.</em>", "vision.p": "VA'A PADDLE connects preparation, tracking and analysis in a single journey — from the first checklist to the team's progress.", "vision.c1": "Live metrics, history, laps and comparisons to guide training decisions.", "vision.c2h": "Safety", "vision.c2": "Checklist, paddle plan, location and SOS flow built into the routine.", "vision.c3h": "Experience", "vision.c3": "A premium, simple interface adapted to the real context of those on the water.", "vision.c4h": "Intelligence", "vision.c4": "Organized data that creates value for athletes, teams and operations.", "plat.eyebrow": "Integrated platform", "plat.h2": "From preparation to analysis, <em>without breaking your rhythm.</em>", "plat.p": "The experience follows the user before, during and after the water. Every module shares the same language, the same data and consistent navigation.", "plat.f1": "<span>01</span> Contextual setup by discipline", "plat.f2": "<span>02</span> Real-time training tracking", "plat.f3": "<span>03</span> Visual analysis of charts and laps", "plat.f4": "<span>04</span> Preferences, sensors and permissions", "plat.link": "See the full journey <span>→</span>", "ent.eyebrow": "Va'a ecosystem", "ent.h2": "FROM THE PADDLER TO THE ECOSYSTEM.<br><em>ONE SINGLE PLATFORM.</em>", "ent.p": "PADDLE is born for the paddler and grows by connecting coaches, clubs, teams and partners within the same Va'a ecosystem.", "ent.l1": "01 — Athlete / Paddler", "ent.h1": "Individual performance.", "ent.p1": "Structured training, specific metrics, progress, history and safety in an experience built for those who paddle.", "ent.l2": "02 — Coaches", "ent.h2b": "Data to train better.", "ent.p2": "Training prescription, performance tracking and analysis of individual and team progress.", "ent.l3": "03 — Clubs &amp; Teams", "ent.h3b": "Team performance.", "ent.p3": "Athletes, training, calendar and progress connected in an environment designed to bring coach and team closer.", "ent.l4": "04 — Ecosystem", "ent.h4b": "A connection between sport, technology and community.", "ent.p4": "Equipment manufacturers, events, races, federations and partners can be part of the PADDLE ecosystem.", "ent.sig1": "Individual by nature.", "ent.sig2": "A platform by potential.", "show.eyebrow": "POST-TRAINING ANALYSIS", "show.h2": "A digital presence worthy of the <em>experience on the water.</em><br>Every lap tells a story.", "saf.eyebrow": "Safety on board", "saf.h2": "Safety isn't a screen.<br><em>It's part of the product.</em>", "saf.p": "The app turns essential precautions into a clear flow: prepare the gear, share the plan, track location and act in an emergency.", "saf.p1": "Mandatory checklist", "saf.p2": "Paddle plan", "saf.p3": "Location", "saf.p4": "Nautical SOS", "jour.eyebrow": "End-to-end journey", "jour.h2": "Simple to use.<br><em>Complete to grow.</em>", "jour.h1": "Prepare", "jour.p1": "Discipline, training type, goal and essential gear.", "jour.h2b": "Row", "jour.p2": "Clear metrics, simple controls and environmental context.", "jour.h3b": "Analyze", "jour.p3": "Summary, charts, laps and comparison with history.", "jour.h4b": "Grow", "jour.p4": "Consistency, records and better decisions for the next session.", "part.eyebrow": "Partnerships &amp; new business", "part.h2": "Bring VA'A PADDLE to <em>your operation.</em>", "part.p": "Let's build a paddling experience aligned with your brand, your audience and your business goals.", "part.cta": "Talk about the project <span>↗</span>", "part.sub": "Product, strategy and digital experience.", "foot.tag": "Performance, safety and management for those who live to paddle.", "foot.mq.safety": "Safety", "foot.mq.mgmt": "Management", "foot.business": "Business", "foot.top": "Back to top ↑", "foot.bottom": "© 2026 VA'A PADDLE. Product concept and navigable prototype."};
  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const ptMap = new Map();
  nodes.forEach((el) => ptMap.set(el, el.innerHTML));
  const btns = Array.from(document.querySelectorAll('.lang-btn'));
  const root = document.documentElement;
  const STORE = 'vaa-lang';

  const apply = (lang) => {
    const en = lang === 'en';
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (en) {
        if (I18N[key] != null) el.innerHTML = I18N[key];
      } else {
        const pt = ptMap.get(el);
        if (pt != null) el.innerHTML = pt;
      }
    });
    root.setAttribute('lang', en ? 'en' : 'pt-BR');
    btns.forEach((b) => {
      const active = b.dataset.lang === lang;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  };

  btns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.lang)));

  let saved = 'pt';
  try { saved = localStorage.getItem(STORE) || 'pt'; } catch (e) {}
  if (saved === 'en') apply('en');
})();
