document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#empresas-cmb");

  if (!section) return;

  /* COLE A URL /exec DO SEU APPS SCRIPT AQUI */
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwFsU_6kydk86whB7VN0kzJCybZxZ41kQJsFiUrcgecaUXOs19b8Af0_od_aeui8w7dTQ/exec";

  const carousel = section.querySelector(
    "[data-companies-carousel]"
  );

  const viewport = carousel.querySelector(
    ".carousel-viewport"
  );

  const track = carousel.querySelector(
    "[data-companies-track]"
  );

  const controls = carousel.querySelector(
    "[data-companies-controls]"
  );

  const previousButton = carousel.querySelector(
    "[data-companies-prev]"
  );

  const nextButton = carousel.querySelector(
    "[data-companies-next]"
  );

  const dotsContainer = carousel.querySelector(
    "[data-companies-dots]"
  );

  const status = carousel.querySelector(
    "[data-companies-status]"
  );

  let items = [];
  let activeIndex = 0;
  let resizeTimeout;

  function getPerView() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1000) return 3;
    return 5;
  }

  function createCompanyCard(item) {
    const slide = document.createElement("article");

    slide.className =
      "carousel-slide company-item";

    const logoBox = document.createElement("div");
    logoBox.className = "company-logo-box";

    const image = document.createElement("img");

    image.src = item.imagem;
    image.alt = item.alt || item.nome || "Empresa";
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
      slide.remove();
      updateCarousel();
    });

    const caption = document.createElement("p");
    caption.textContent = item.nome || "Empresa";

    logoBox.appendChild(image);
    slide.append(logoBox, caption);

    return slide;
  }

  function getSlides() {
    return [
      ...track.querySelectorAll(".company-item")
    ];
  }

  function getMaximumIndex() {
    return Math.max(
      0,
      getSlides().length - getPerView()
    );
  }

  function renderCards() {
    track.innerHTML = "";
    activeIndex = 0;

    items.forEach((item) => {
      track.appendChild(createCompanyCard(item));
    });

    updateCarousel();
  }

  function renderDots(maximumIndex) {
    dotsContainer.innerHTML = "";

    for (
      let dotIndex = 0;
      dotIndex <= maximumIndex;
      dotIndex += 1
    ) {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute(
        "aria-label",
        `Ir para a posição ${dotIndex + 1}`
      );

      if (dotIndex === activeIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }

      dot.addEventListener("click", () => {
        activeIndex = dotIndex;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const slides = getSlides();

    if (!slides.length) {
      controls.hidden = true;
      return;
    }

    const perView = getPerView();
    const maximumIndex = Math.max(
      0,
      slides.length - perView
    );

    activeIndex = Math.min(activeIndex, maximumIndex);

    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap) || 18;

    const slideWidth =
      (viewport.clientWidth - gap * (perView - 1)) /
      perView;

    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });

    const distance =
      activeIndex * (slideWidth + gap);

    track.style.transform =
      `translate3d(-${distance}px, 0, 0)`;

    const hasNavigation = slides.length > perView;

    controls.hidden = !hasNavigation;

    previousButton.disabled = activeIndex === 0;
    nextButton.disabled =
      activeIndex >= maximumIndex;

    renderDots(maximumIndex);
  }

  previousButton.addEventListener("click", () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    activeIndex = Math.min(
      getMaximumIndex(),
      activeIndex + 1
    );

    updateCarousel();
  });

  function loadCompaniesWithJsonp() {
    return new Promise((resolve, reject) => {
      const callbackName = "cbmCompaniesCallback";

      window[callbackName] = (response) => {
        delete window[callbackName];
        script.remove();
        resolve(response);
      };

      const script = document.createElement("script");

      script.src =
        `${APPS_SCRIPT_URL}?callback=window.${callbackName}` +
        `&v=${Date.now()}`;

      script.async = true;

      script.onerror = () => {
        delete window[callbackName];
        script.remove();

        reject(
          new Error(
            "Não foi possível carregar as empresas."
          )
        );
      };

      document.body.appendChild(script);
    });
  }

  async function loadCompanies() {
    if (
      APPS_SCRIPT_URL.includes("COLE_AQUI")
    ) {
      status.textContent =
        "Adicione a URL do Web App no arquivo empresas.js.";

      status.classList.add("is-error");
      return;
    }

    try {
      const response =
        await loadCompaniesWithJsonp();

      if (!response.ok) {
        throw new Error(response.message);
      }

      items = response.items || [];

      if (!items.length) {
        status.textContent =
          "Nenhuma imagem foi encontrada nas pastas.";
        return;
      }

      status.remove();
      renderCards();
    } catch (error) {
      status.textContent =
        "Não foi possível carregar as empresas agora.";

      status.classList.add("is-error");

      console.error(error);
    }
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 150);
  });

  loadCompanies();
});
