document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#empresas-cmb");
  if (!section) return;

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwFsU_6kydk86whB7VN0kzJCybZxZ41kQJsFiUrcgecaUXOs19b8Af0_od_aeui8w7dTQ/exec";

  /* CONFIGURAÇÕES */
  const AUTOPLAY_MS = 4000; // Tempo entre avanços automáticos
  const CACHE_MS = 10 * 60 * 1000; // 10 minutos
  const REQUEST_TIMEOUT_MS = 25000;
  const CACHE_KEY = "cmb-companies-browser-v2";

  const carousel = section.querySelector("[data-companies-carousel]");
  if (!carousel || carousel.dataset.companiesReady) return;
  carousel.dataset.companiesReady = "true";

  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector("[data-companies-track]");
  const controls = carousel.querySelector("[data-companies-controls]");
  const previousButton = carousel.querySelector("[data-companies-prev]");
  const nextButton = carousel.querySelector("[data-companies-next]");
  const dots = carousel.querySelector("[data-companies-dots]");
  const status = carousel.querySelector("[data-companies-status]");

  if (
    !viewport || !track || !controls ||
    !previousButton || !nextButton || !dots || !status
  ) {
    console.error("Empresas: faltam elementos no HTML.");
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let slides = [];
  let activeIndex = 0;
  let step = 0;
  let timer = null;
  let resizeFrame = null;
  let inView = false;
  let hovered = false;
  let focused = false;
  let manuallyPaused = reducedMotion.matches;
  let drag = null;
  let suppressClickUntil = 0;

  /* Botão acessível para pausar o movimento */
  const pauseButton = document.createElement("button");
  pauseButton.type = "button";
  pauseButton.className = "round-arrow companies-pause";
  controls.appendChild(pauseButton);

  function updatePauseButton() {
    pauseButton.textContent = manuallyPaused ? "▶" : "Ⅱ";
    pauseButton.setAttribute(
      "aria-label",
      manuallyPaused
        ? "Retomar passagem automática"
        : "Pausar passagem automática"
    );
    pauseButton.setAttribute("aria-pressed", String(manuallyPaused));
  }

  function getPerView() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1000) return 3;
    return 5;
  }

  function getMaximumIndex() {
    return Math.max(0, slides.length - getPerView());
  }

  function stopAutoplay() {
    clearTimeout(timer);
    timer = null;
  }

  function scheduleAutoplay() {
    stopAutoplay();

    if (
      manuallyPaused || reducedMotion.matches ||
      document.hidden || !inView ||
      hovered || focused || drag ||
      getMaximumIndex() === 0
    ) {
      return;
    }

    timer = setTimeout(() => {
      move(1);
    }, AUTOPLAY_MS);
  }

  function setStatus(message, error = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle("is-error", error);
  }

  /* Só solicita as imagens visíveis e as próximas */
  function loadNearbyImages() {
    const perView = getPerView();
    const indexes = new Set();

    for (
      let index = Math.max(0, activeIndex - 1);
      index < Math.min(slides.length, activeIndex + perView + 2);
      index += 1
    ) {
      indexes.add(index);
    }

    // Prepara o retorno ao começo
    if (activeIndex === getMaximumIndex()) {
      for (let index = 0; index < perView; index += 1) {
        indexes.add(index);
      }
    }

    indexes.forEach((index) => {
      const image = slides[index]?.querySelector("img[data-src]");
      if (!image) return;

      image.loading = "eager";
      image.fetchPriority =
        index >= activeIndex && index < activeIndex + perView
          ? "high"
          : "low";

      const source = image.dataset.src;
      delete image.dataset.src;
      image.src = source;
    });
  }

  function refreshDots() {
    [...dots.children].forEach((dot, index) => {
      const active = index === activeIndex;
      dot.classList.toggle("is-active", active);

      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function buildDots() {
    const maximum = getMaximumIndex();
    const count = maximum > 0 ? maximum + 1 : 0;

    if (dots.children.length !== count) {
      dots.replaceChildren();

      for (let index = 0; index < count; index += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir para a posição ${index + 1}`);

        dot.addEventListener("click", () => {
          goTo(index);
        });

        dots.appendChild(dot);
      }
    }

    refreshDots();
  }

  function paint(animate = true) {
    track.style.transition =
      animate && !reducedMotion.matches ? "" : "none";

    track.style.transform =
      `translate3d(${-activeIndex * step}px, 0, 0)`;

    loadNearbyImages();
    refreshDots();
  }

  function goTo(index) {
    activeIndex = Math.max(0, Math.min(getMaximumIndex(), index));
    paint();
    scheduleAutoplay();
  }

  function move(direction) {
    const maximum = getMaximumIndex();
    if (maximum === 0) return;

    let next = activeIndex + direction;

    if (next > maximum) next = 0;
    if (next < 0) next = maximum;

    goTo(next);
  }

  function updateCarousel() {
    const perView = getPerView();

    const gap =
      parseFloat(getComputedStyle(track).columnGap) || 0;

    // O track já ocupa apenas a área útil do viewport
    const availableWidth = track.clientWidth;
    if (!availableWidth) return;

    const slideWidth = Math.max(
      0,
      (availableWidth - gap * (perView - 1)) / perView
    );

    step = slideWidth + gap;

    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.width = `${slideWidth}px`;
    });

    activeIndex = Math.min(activeIndex, getMaximumIndex());

    const hasNavigation = getMaximumIndex() > 0;
    controls.hidden = !hasNavigation;

    // No loop, as setas não são bloqueadas nas extremidades
    previousButton.disabled = !hasNavigation;
    nextButton.disabled = !hasNavigation;

    buildDots();
    paint(false);
    scheduleAutoplay();
  }

  function createCompanyCard(item) {
    const slide = document.createElement("article");
    slide.className = "carousel-slide company-item";

    const box = document.createElement("div");
    box.className = "company-logo-box";

    const image = document.createElement("img");
    image.alt = item.alt || item.nome || "Empresa participante";
    image.decoding = "async";
    image.draggable = false;
    image.dataset.src = item.imagem;

    image.addEventListener("error", () => {
      image.remove();

      const fallback = document.createElement("span");
      fallback.className = "company-image-fallback";
      fallback.textContent = "Logo indisponível";

      box.appendChild(fallback);
    }, { once: true });

    const caption = document.createElement("p");
    caption.textContent = item.nome || "Empresa participante";

    box.appendChild(image);
    slide.append(box, caption);
    return slide;
  }

  function shuffle(list) {
    const result = [...list];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [result[index], result[random]] = [result[random], result[index]];
    }

    return result;
  }

  function renderCards(items) {
    const sponsors = [];
    const others = [];

    items.forEach((item) => {
      const sponsor =
        String(item.nome).trim().toLowerCase() === "patrocinador";

      (sponsor ? sponsors : others).push(item);
    });

    slides = [...sponsors, ...shuffle(others)].map(createCompanyCard);
    track.replaceChildren(...slides);

    activeIndex = 0;
    setStatus(slides.length ? "" : "Nenhuma empresa cadastrada.");
    updateCarousel();
  }

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  pauseButton.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    updatePauseButton();
    scheduleAutoplay();
  });

  carousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    stopAutoplay();
  });

  carousel.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = false;
    scheduleAutoplay();
  });

  carousel.addEventListener("focusin", () => {
    focused = true;
    stopAutoplay();
  });

  carousel.addEventListener("focusout", () => {
    setTimeout(() => {
      focused = carousel.contains(document.activeElement);
      scheduleAutoplay();
    }, 0);
  });

  document.addEventListener("visibilitychange", scheduleAutoplay);

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) manuallyPaused = true;
    updatePauseButton();
    scheduleAutoplay();
  });

  /* ARRASTE COM MOUSE E DEDO */
  viewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (
      !event.isPrimary || event.button !== 0 ||
      getMaximumIndex() === 0
    ) {
      return;
    }

    stopAutoplay();

    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset: 0,
      horizontal: false
    };

    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;

    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;

      if (Math.abs(dy) > Math.abs(dx)) {
        finishDrag(event, true);
        return;
      }

      drag.horizontal = true;
      carousel.classList.add("is-dragging");
    }

    event.preventDefault();
    drag.offset = dx;

    track.style.transition = "none";
    track.style.transform =
      `translate3d(${-activeIndex * step + dx}px, 0, 0)`;
  });

  function finishDrag(event, cancelled = false) {
    if (!drag || drag.id !== event.pointerId) return;

    const previousDrag = drag;
    drag = null;

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    carousel.classList.remove("is-dragging");

    if (previousDrag.horizontal) {
      suppressClickUntil = Date.now() + 350;
    }

    const threshold = Math.min(60, step * 0.2);

    if (
      !cancelled && previousDrag.horizontal &&
      Math.abs(previousDrag.offset) >= threshold
    ) {
      move(previousDrag.offset < 0 ? 1 : -1);
    } else {
      paint();
      scheduleAutoplay();
    }
  }

  viewport.addEventListener("pointerup", (event) => finishDrag(event));
  viewport.addEventListener("pointercancel", (event) => finishDrag(event, true));
  viewport.addEventListener("lostpointercapture", (event) => {
    finishDrag(event, true);
  });

  viewport.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  /* CACHE DA LISTA NO NAVEGADOR */
  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));

      if (
        cached?.url === APPS_SCRIPT_URL &&
        Array.isArray(cached.items) &&
        Date.now() - cached.savedAt < CACHE_MS
      ) {
        return cached.items;
      }
    } catch {
      // O carrossel continua funcionando se o navegador bloquear storage.
    }

    return null;
  }

  function writeCache(items) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        url: APPS_SCRIPT_URL,
        savedAt: Date.now(),
        items
      }));
    } catch {
      // Cache é opcional.
    }
  }

  function loadCompaniesWithJsonp() {
    return new Promise((resolve, reject) => {
      const callbackName =
        "cmbCompanies_" + Date.now() + "_" +
        Math.random().toString(36).slice(2);

      const script = document.createElement("script");
      let finished = false;

      function finish(error, response) {
        if (finished) return;
        finished = true;

        clearTimeout(timeout);
        script.remove();

        // Evita erro caso uma resposta atrasada ainda seja executada.
        window[callbackName] = () => {};
        setTimeout(() => delete window[callbackName], 60000);

        if (error) reject(error);
        else resolve(response);
      }

      window[callbackName] = (response) => finish(null, response);

      const timeout = setTimeout(() => {
        finish(new Error("O Apps Script demorou demais para responder."));
      }, REQUEST_TIMEOUT_MS);

      script.onerror = () => {
        finish(new Error("Falha ao acessar o Apps Script."));
      };

      const url = new URL(APPS_SCRIPT_URL);
      url.searchParams.set("callback", callbackName);

      script.src = url.href;
      script.async = true;
      document.head.appendChild(script);
    });
  }

  async function loadCompanies() {
    controls.hidden = true;
    setStatus("Carregando empresas...");

    const cached = readCache();

    if (cached) {
      renderCards(cached);
      return;
    }

    try {
      const response = await loadCompaniesWithJsonp();

      if (!response?.ok || !Array.isArray(response.items)) {
        throw new Error(response?.message || "Resposta inválida.");
      }

      const items = response.items.filter((item) => {
        if (!item || typeof item.imagem !== "string") return false;

        try {
          return new URL(item.imagem).protocol === "https:";
        } catch {
          return false;
        }
      });

      writeCache(items);
      renderCards(items);
    } catch (error) {
      console.error("Empresas CMB:", error);

      setStatus("Não foi possível carregar as empresas. ", true);

      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "Tentar novamente";
      retry.addEventListener("click", loadCompanies, { once: true });

      status.appendChild(retry);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    scheduleAutoplay();
  }, { threshold: 0.1 });

  observer.observe(carousel);

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(updateCarousel);
  });

  resizeObserver.observe(viewport);

  updatePauseButton();
  loadCompanies();
});
