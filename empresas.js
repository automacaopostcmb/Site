document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#empresas-cmb");

  if (!section) return;

  /* COLE AQUI A URL /exec DO SEU APPS SCRIPT */
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwFsU_6kydk86whB7VN0kzJCybZxZ41kQJsFiUrcgecaUXOs19b8Af0_od_aeui8w7dTQ/exec";

  const carousel = section.querySelector(
    "[data-companies-carousel]"
  );

  const track = section.querySelector(
    "[data-companies-track]"
  );

  const controls = section.querySelector(
    "[data-companies-controls]"
  );

  const previousButton = section.querySelector(
    "[data-companies-prev]"
  );

  const nextButton = section.querySelector(
    "[data-companies-next]"
  );

  const dots = section.querySelector(
    "[data-companies-dots]"
  );

  const status = section.querySelector(
    "[data-companies-status]"
  );

  let items = [];
  let activeIndex = 0;
  let resizeTimeout;

  function getPerView() {
    if (window.innerWidth <= 640) return 2;
    if (window.innerWidth <= 900) return 3;
    return 4;
  }

  function createCard(item) {
    const slide = document.createElement("article");
    slide.className = "companies-cmb-slide";

    const card = document.createElement("div");
    card.className = "companies-cmb-card";

    const logoBox = document.createElement("div");
    logoBox.className = "companies-cmb-logo-box";

    const image = document.createElement("img");
    image.src = item.imagem;
    image.alt = item.alt || item.nome || "Empresa participante";
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("p");
    caption.textContent = item.nome || "Empresa participante";

    image.addEventListener("error", () => {
      slide.remove();
      updateCarousel();
    });

    logoBox.appendChild(image);
    card.append(logoBox, caption);
    slide.appendChild(card);

    return slide;
  }

  function renderCards() {
    track.innerHTML = "";

    items.forEach((item) => {
      track.appendChild(createCard(item));
    });

    updateCarousel();
  }

  function getMaximumIndex() {
    return Math.max(0, items.length - getPerView());
  }

  function getDotIndexes() {
    const perView = getPerView();
    const maximumIndex = getMaximumIndex();
    const indexes = [];

    for (let index = 0; index <= maximumIndex; index += perView) {
      indexes.push(index);
    }

    if (
      indexes.length &&
      indexes[indexes.length - 1] !== maximumIndex
    ) {
      indexes.push(maximumIndex);
    }

    return indexes;
  }

  function renderDots() {
    dots.innerHTML = "";

    const dotIndexes = getDotIndexes();

    dotIndexes.forEach((index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "companies-cmb-dot";
      dot.setAttribute(
        "aria-label",
        `Ir para o grupo ${dotIndexes.indexOf(index) + 1}`
      );

      if (index === activeIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }

      dot.addEventListener("click", () => {
        activeIndex = index;
        updateCarousel();
      });

      dots.appendChild(dot);
    });
  }

  function updateCarousel() {
    const slides = [
      ...track.querySelectorAll(".companies-cmb-slide")
    ];

    if (!slides.length) return;

    const perView = getPerView();
    const maximumIndex = Math.max(0, slides.length - perView);

    activeIndex = Math.min(activeIndex, maximumIndex);

    const gap =
      window.innerWidth <= 640 ? 12 : 18;

    const slideWidth =
      (carousel.clientWidth - gap * (perView - 1)) / perView;

    slides.forEach((slide) => {
      slide.style.flexBasis = `${slideWidth}px`;
    });

    track.style.transform =
      `translate3d(-${activeIndex * (slideWidth + gap)}px, 0, 0)`;

    const hasNavigation = slides.length > perView;

    controls.hidden = !hasNavigation;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex >= maximumIndex;

    renderDots();
  }

  function goToNext() {
    const maximumIndex = getMaximumIndex();

    activeIndex = Math.min(
      maximumIndex,
      activeIndex + getPerView()
    );

    updateCarousel();
  }

  function goToPrevious() {
    activeIndex = Math.max(
      0,
      activeIndex - getPerView()
    );

    updateCarousel();
  }

  previousButton.addEventListener("click", goToPrevious);
  nextButton.addEventListener("click", goToNext);

  function loadWithJsonp() {
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
          new Error("Não foi possível carregar as empresas.")
        );
      };

      document.body.appendChild(script);
    });
  }

  async function loadCompanies() {
    if (
      !APPS_SCRIPT_URL ||
      APPS_SCRIPT_URL.includes("COLE_AQUI")
    ) {
      status.textContent =
        "Adicione a URL do Web App no arquivo empresas.js.";
      status.classList.add("is-error");
      return;
    }

    try {
      const response = await loadWithJsonp();

      if (!response.ok) {
        throw new Error(
          response.message ||
            "Não foi possível carregar as empresas."
        );
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
