document.addEventListener("DOMContentLoaded", () => {
  const learningSection = document.querySelector("#ingresso-learning");
  const classArea = document.querySelector("#learning-class-area");

  if (!learningSection || !classArea) return;

  /* =======================================================
     DADOS PROVISÓRIOS

     O primeiro número define a quantidade de professores.

     Exemplo:
     criarAulas(4, 1) = grade normal com 4 cards
     criarAulas(5, 1) = carrossel com 5 cards
     criarAulas(8, 1) = carrossel com 8 cards
     ======================================================= */

function aula({
  professor,
  titulo,
  categoria,
  nivel,
  foto,
  resumo = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  descricao = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
}) {
  return {
    professor,
    titulo,
    categoria,
    nivel,
    foto,
    resumo,
    descricao
  };
}

const learningData = {
  sabado: {
    "09:30": [
      {
        professor: "Bruno Lima",
        titulo: "Desenhando Cabeças, Rostos e Expressões",
        categoria: "Ilustração",
        nivel: "Iniciante",
        foto:"https://raw.githubusercontent.com/automacaopostcmb/Site/c623dc3bd78f261d5d575152ed69d90e5b918ba1/prof_lima.png",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravaida."
      },

      {
        professor: "Nome do professor 2",
        titulo: "Título da aula 2",
        categoria: "Ilustração",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 3",
        titulo: "Título da aula 3",
        categoria: "Roteiro",
        nivel: "Intermediário",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 4",
        titulo: "Título da aula 4",
        categoria: "Mercado",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      }
    ],

    "13:00": [
      {
        professor: "Nome do professor 5",
        titulo: "Título da aula 5",
        categoria: "Desenho",
        nivel: "Iniciante",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 6",
        titulo: "Título da aula 6",
        categoria: "Pintura",
        nivel: "Intermediário",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 7",
        titulo: "Título da aula 7",
        categoria: "Quadrinhos",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 8",
        titulo: "Título da aula 8",
        categoria: "Negócios",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      }
    ],

    "14:30": [
 {
        professor: "Nome do professor 9",
        titulo: "Título da aula 9",
        categoria: "Desenho",
        nivel: "Iniciante",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 10",
        titulo: "Título da aula 10",
        categoria: "Pintura",
        nivel: "Intermediário",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 11",
        titulo: "Título da aula 11",
        categoria: "Quadrinhos",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 12",
        titulo: "Título da aula 12",
        categoria: "Negócios",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      }
    ],
    "16:00": [
 {
        professor: "Nome do professor 13",
        titulo: "Título da aula 13",
        categoria: "Desenho",
        nivel: "Iniciante",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 14",
        titulo: "Título da aula 14",
        categoria: "Pintura",
        nivel: "Intermediário",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 15",
        titulo: "Título da aula 15",
        categoria: "Quadrinhos",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      },

      {
        professor: "Nome do professor 16",
        titulo: "Título da aula 16",
        categoria: "Negócios",
        nivel: "Todos os níveis",
        foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg",
        resumo:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        descricao:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus quis mauris tincidunt gravida."
      }
    ]
  },

domingo: {
  "09:30": [
    aula({
      professor: "Professor(a) 17",
      titulo: "Título da aula 17",
      categoria: "Quadrinhos",
      nivel: "Iniciante",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 18",
      titulo: "Título da aula 18",
      categoria: "Ilustração",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 19",
      titulo: "Título da aula 19",
      categoria: "Roteiro",
      nivel: "Intermediário",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 20",
      titulo: "Título da aula 20",
      categoria: "Mercado",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    })
  ],

  "13:00": [
    aula({
      professor: "Professor(a) 21",
      titulo: "Título da aula 21",
      categoria: "Desenho",
      nivel: "Iniciante",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 22",
      titulo: "Título da aula 22",
      categoria: "Pintura",
      nivel: "Intermediário",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 23",
      titulo: "Título da aula 23",
      categoria: "Quadrinhos",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 24",
      titulo: "Título da aula 24",
      categoria: "Negócios",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    })
  ],

  "14:30": [
    aula({
      professor: "Professor(a) 25",
      titulo: "Título da aula 25",
      categoria: "Anatomia",
      nivel: "Iniciante",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 26",
      titulo: "Título da aula 26",
      categoria: "Arte digital",
      nivel: "Intermediário",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 27",
      titulo: "Título da aula 27",
      categoria: "Narrativa",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 28",
      titulo: "Título da aula 28",
      categoria: "Publicação",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    })
  ],

  "16:00": [
    aula({
      professor: "Professor(a) 29",
      titulo: "Título da aula 29",
      categoria: "Personagens",
      nivel: "Iniciante",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 30",
      titulo: "Título da aula 30",
      categoria: "Colorização",
      nivel: "Intermediário",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 31",
      titulo: "Título da aula 31",
      categoria: "Roteiro",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    }),

    aula({
      professor: "Professor(a) 32",
      titulo: "Título da aula 32",
      categoria: "Carreira",
      nivel: "Todos os níveis",
      foto: "https://raw.githubusercontent.com/automacaopostcmb/Site/refs/heads/main/logo.svg"
    })
  ]
}
};

  let activeDay = "sabado";
  let activeTime = "09:30";
  let carouselState = null;
  let resizeTimeout;

  /* =======================================================
     CARD
     ======================================================= */

  function createClassCard(aula, index) {
    const detailId =
      `learning-detail-${activeDay}-${activeTime.replace(":", "")}-${index}`;

    return `
      <article class="learning-class-card">

        <div class="learning-class-main">
          <img
            class="learning-teacher-photo"
            src="${aula.foto}"
            alt="${aula.professor}"
            loading="lazy"
            decoding="async"
          >

          <div class="learning-class-info">
            <span class="learning-teacher-name">
              ${aula.professor}
            </span>

            <h3 class="learning-class-title">
              ${aula.titulo}
            </h3>

            <div class="learning-class-tags">
              <span class="learning-class-tag">
                ${aula.categoria}
              </span>

              <span class="learning-class-level">
                ${aula.nivel}
              </span>
            </div>
          </div>
        </div>

        <div class="learning-class-footer">
          <p class="learning-class-summary">
            ${aula.resumo}
          </p>

          <button
            class="learning-card-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="${detailId}"
            aria-label="Ver detalhes da aula ${aula.titulo}"
          >
            +
          </button>
        </div>

        <div
          class="learning-class-details"
          id="${detailId}"
        >
          <div>
            <p>${aula.descricao}</p>
          </div>
        </div>

      </article>
    `;
  }

  /* =======================================================
     DEFINE QUANTOS CARDS APARECEM NO CARROSSEL
     ======================================================= */

  function getCarouselPerView() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 4;
  }

  /* =======================================================
     GRADE OU CARROSSEL
     ======================================================= */

  function renderClasses() {
    const classes = learningData[activeDay][activeTime];
    carouselState = null;

    /* Até quatro: grade comum e sem controles */
if (classes.length <= 4 || window.innerWidth <= 700) {
      classArea.innerHTML = `
        <div class="learning-class-grid">
          ${classes
            .map((aula, index) => createClassCard(aula, index))
            .join("")}
        </div>
      `;

      return;
    }

    /* Mais de quatro: carrossel automático */
    classArea.innerHTML = `
      <div class="learning-carousel">

        <div class="learning-carousel-viewport">
          <div class="learning-carousel-track">
            ${classes
              .map(
                (aula, index) => `
                  <div class="learning-carousel-slide">
                    ${createClassCard(aula, index)}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="learning-carousel-controls">
          <button
            class="learning-carousel-arrow"
            type="button"
            data-learning-prev
            aria-label="Ver aula anterior"
          >
            ←
          </button>

          <div
            class="learning-carousel-dots"
            aria-label="Navegação das aulas"
          ></div>

          <button
            class="learning-carousel-arrow"
            type="button"
            data-learning-next
            aria-label="Ver próxima aula"
          >
            →
          </button>
        </div>

      </div>
    `;

    setupCarousel(classes.length);
  }

  /* =======================================================
     FUNCIONAMENTO DO CARROSSEL
     ======================================================= */

  function setupCarousel(totalSlides) {
    const carousel = classArea.querySelector(".learning-carousel");
    const viewport = carousel.querySelector(".learning-carousel-viewport");
    const track = carousel.querySelector(".learning-carousel-track");
    const slides = [...carousel.querySelectorAll(".learning-carousel-slide")];
    const prevButton = carousel.querySelector("[data-learning-prev]");
    const nextButton = carousel.querySelector("[data-learning-next]");
    const dotsContainer = carousel.querySelector(".learning-carousel-dots");

    carouselState = {
      carousel,
      viewport,
      track,
      slides,
      prevButton,
      nextButton,
      dotsContainer,
      totalSlides,
      index: 0,
      perView: getCarouselPerView()
    };

    prevButton.addEventListener("click", () => {
      if (!carouselState) return;

      carouselState.index = Math.max(0, carouselState.index - 1);
      updateCarousel();
    });

    nextButton.addEventListener("click", () => {
      if (!carouselState) return;

      const maximumIndex =
        carouselState.totalSlides - carouselState.perView;

      carouselState.index = Math.min(
        maximumIndex,
        carouselState.index + 1
      );

      updateCarousel();
    });

    updateCarousel();
  }

  function updateCarousel() {
    if (!carouselState) return;

    const {
      viewport,
      track,
      slides,
      prevButton,
      nextButton,
      dotsContainer,
      totalSlides
    } = carouselState;

    const perView = getCarouselPerView();
    const gap = 14;
    const slideWidth =
      (viewport.clientWidth - gap * (perView - 1)) / perView;

    const maximumIndex = Math.max(0, totalSlides - perView);

    carouselState.perView = perView;
    carouselState.index = Math.min(
      carouselState.index,
      maximumIndex
    );

    slides.forEach((slide) => {
      slide.style.flexBasis = `${slideWidth}px`;
    });

    const distance =
      carouselState.index * (slideWidth + gap);

    track.style.transform =
      `translate3d(-${distance}px, 0, 0)`;

    prevButton.disabled = carouselState.index === 0;
    nextButton.disabled =
      carouselState.index >= maximumIndex;

    renderCarouselDots(maximumIndex);
  }

  function renderCarouselDots(maximumIndex) {
    if (!carouselState) return;

    const { dotsContainer, index } = carouselState;

    dotsContainer.innerHTML = "";

    for (let dotIndex = 0; dotIndex <= maximumIndex; dotIndex++) {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "learning-carousel-dot";
      dot.setAttribute(
        "aria-label",
        `Ir para a posição ${dotIndex + 1}`
      );

      if (dotIndex === index) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }

      dot.addEventListener("click", () => {
        if (!carouselState) return;

        carouselState.index = dotIndex;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  }

  /* =======================================================
     SELEÇÃO DO DIA
     ======================================================= */

  learningSection.addEventListener("click", (event) => {
    const dayButton = event.target.closest("[data-learning-day]");

if (dayButton) {
  activeDay = dayButton.dataset.learningDay;

  /* Retorna automaticamente ao primeiro horário do dia */
  activeTime = Object.keys(learningData[activeDay])[0];

  /* Atualiza os botões dos dias */
  learningSection
    .querySelectorAll("[data-learning-day]")
    .forEach((button) => {
      const isActive =
        button.dataset.learningDay === activeDay;

      button.classList.toggle("is-active", isActive);
      button.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });

  /* Atualiza visualmente os botões de horário */
  learningSection
    .querySelectorAll("[data-learning-time]")
    .forEach((button) => {
      const isActive =
        button.dataset.learningTime === activeTime;

      button.classList.toggle("is-active", isActive);
      button.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });



  renderClasses();
  return;
}
  });

/* =========================================================
   GERADOR DE CRONOGRAMA LEARNING
   ========================================================= */

const builderOpenButton = document.querySelector(
  "[data-schedule-builder-open]"
);

const builderModal = document.querySelector(
  "[data-schedule-builder-modal]"
);

if (builderOpenButton && builderModal) {
  const dayView = builderModal.querySelector(
    "[data-builder-day-view]"
  );

  const classesView = builderModal.querySelector(
    "[data-builder-classes-view]"
  );

  const successView = builderModal.querySelector(
    "[data-builder-success-view]"
  );

  const classOptions = builderModal.querySelector(
    "[data-builder-class-options]"
  );

  const progressText = builderModal.querySelector(
    "[data-builder-progress-text]"
  );

  const progressBar = builderModal.querySelector(
    "[data-builder-progress-bar]"
  );

  const selectedDayLabel = builderModal.querySelector(
    "[data-builder-selected-day]"
  );

  const timeTitle = builderModal.querySelector(
    "[data-builder-time-title]"
  );

  const nextButton = builderModal.querySelector(
    "[data-builder-next]"
  );

  const backButton = builderModal.querySelector(
    "[data-builder-back]"
  );

  const previewImage = builderModal.querySelector(
    "[data-builder-preview]"
  );

const downloadButton = builderModal.querySelector(
  "[data-builder-download]"
);
  
  const shareButton = builderModal.querySelector(
    "[data-builder-share]"
  );

  const shareNote = builderModal.querySelector(
    "[data-builder-share-note]"
  );

  const otherDayButton = builderModal.querySelector(
    "[data-builder-other-day]"
  );

  const editButton = builderModal.querySelector(
    "[data-builder-edit]"
  );


    const LEARNING_ANALYTICS_URL =
    "https://script.google.com/macros/s/AKfycbwFsU_6kydk86whB7VN0kzJCybZxZ41kQJsFiUrcgecaUXOs19b8Af0_od_aeui8w7dTQ/exec";



  
  const cronogramaBackgrounds = {
    sabado:
      "https://raw.githubusercontent.com/automacaopostcmb/Site/529b642ea6317bc95b8042a07d37b383ce923569/cronosabado.png",

    domingo:
      "https://raw.githubusercontent.com/automacaopostcmb/Site/529b642ea6317bc95b8042a07d37b383ce923569/cronodomingo.png"
  };

const builderState = {
  dia: null,
  horarios: [],
  etapa: 0,
  selecoes: {},
  imagemBlob: null,
  imagemUrl: null,
  contabilizado: false
};

  let builderLastFocusedElement = null;

  /* -------------------------------------------------------
     UTILITÁRIOS
     ------------------------------------------------------- */

  function escapeBuilderHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showBuilderView(view) {
    dayView.hidden = view !== "day";
    classesView.hidden = view !== "classes";
    successView.hidden = view !== "success";
  }

  function openScheduleBuilder() {
    builderLastFocusedElement = document.activeElement;

    builderState.dia = null;
    builderState.horarios = [];
    builderState.etapa = 0;
    builderState.selecoes = {};
builderState.contabilizado = false;
    showBuilderView("day");

    builderModal.hidden = false;
    document.body.style.overflow = "hidden";

    builderModal
      .querySelector("[data-schedule-builder-exit]")
      ?.focus();
  }

  function closeScheduleBuilder() {
    builderModal.hidden = true;
    document.body.style.overflow = "";

    if (builderLastFocusedElement) {
      builderLastFocusedElement.focus();
    }
  }

  function currentBuilderTime() {
    return builderState.horarios[builderState.etapa];
  }

  function currentBuilderClasses() {
    const horario = currentBuilderTime();

    return learningData[builderState.dia]?.[horario] || [];
  }

  function selectedBuilderClass(horario) {
    const selectedIndex = builderState.selecoes[horario];

    if (selectedIndex === undefined) return null;

    return learningData[builderState.dia]?.[horario]?.[
      selectedIndex
    ] || null;
  }

  /* -------------------------------------------------------
     ESCOLHA DO DIA
     ------------------------------------------------------- */

  function startBuilderDay(day) {
    const dayData = learningData[day];

    if (!dayData) {
      window.alert("Não encontramos aulas cadastradas para este dia.");
      return;
    }

    builderState.dia = day;
    builderState.horarios = Object.keys(dayData);
    builderState.etapa = 0;
    builderState.selecoes = {};
builderState.contabilizado = false;
    
    showBuilderView("classes");
    renderBuilderStep();
  }

  /* -------------------------------------------------------
     RENDERIZA O HORÁRIO ATUAL
     ------------------------------------------------------- */

  function renderBuilderStep() {
    const horario = currentBuilderTime();
    const classes = currentBuilderClasses();
    const selectedIndex = builderState.selecoes[horario];
    const isLastStep =
      builderState.etapa === builderState.horarios.length - 1;

    const dayName =
      builderState.dia === "sabado" ? "Sábado" : "Domingo";

    progressText.textContent =
      `Horário ${builderState.etapa + 1} de ${builderState.horarios.length}`;

    progressBar.style.width =
      `${((builderState.etapa + 1) / builderState.horarios.length) * 100}%`;

    selectedDayLabel.textContent = dayName;
    timeTitle.textContent = `Escolha sua aula das ${horario}`;
    
    nextButton.textContent = isLastStep
      ? "Salvar Grade"
      : "Próximo horário";

    nextButton.disabled = selectedIndex === undefined;

    if (!classes.length) {
      classOptions.innerHTML = `
        <p class="schedule-builder-empty">
          Nenhuma aula foi cadastrada para este horário.
        </p>
      `;

      nextButton.disabled = true;
      return;
    }

    classOptions.innerHTML = classes
      .map((lesson, index) => {
        const selected = index === selectedIndex;

        return `
          <button
            class="schedule-builder-choice${selected ? " is-selected" : ""}"
            type="button"
            data-builder-class-index="${index}"
            aria-pressed="${selected}"
          >
            <img
              src="${escapeBuilderHTML(lesson.foto)}"
              alt="${escapeBuilderHTML(lesson.professor)}"
              loading="lazy"
              decoding="async"
            >

            <span class="schedule-builder-choice-copy">
              <strong>
                ${escapeBuilderHTML(lesson.professor)}
              </strong>

              <h4>
                ${escapeBuilderHTML(lesson.titulo)}
              </h4>

              <span class="schedule-builder-choice-tags">
                <span>
                  ${escapeBuilderHTML(lesson.categoria)}
                </span>

                <span>
                  ${escapeBuilderHTML(lesson.nivel)}
                </span>
              </span>
            </span>

            <span
              class="schedule-builder-choice-check"
              aria-hidden="true"
            >
              ✓
            </span>
          </button>
        `;
      })
      .join("");

    classOptions.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  /* -------------------------------------------------------
     NAVEGAÇÃO
     ------------------------------------------------------- */

  function goToPreviousBuilderStep() {
    if (builderState.etapa > 0) {
      builderState.etapa -= 1;
      renderBuilderStep();
      return;
    }

    showBuilderView("day");
  }

  async function goToNextBuilderStep() {
    const horario = currentBuilderTime();

    if (builderState.selecoes[horario] === undefined) {
      return;
    }

    const isLastStep =
      builderState.etapa === builderState.horarios.length - 1;

    if (!isLastStep) {
      builderState.etapa += 1;
      renderBuilderStep();
      return;
    }

await createScheduleImage();
  }

  /* -------------------------------------------------------
     CANVAS
     ------------------------------------------------------- */

  function createRoundedPath(context, x, y, width, height, radius) {
    const safeRadius = Math.min(
      radius,
      width / 2,
      height / 2
    );

    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(
      x + width,
      y,
      x + width,
      y + safeRadius
    );

    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - safeRadius,
      y + height
    );

    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(
      x,
      y + height,
      x,
      y + height - safeRadius
    );

    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(
      x,
      y,
      x + safeRadius,
      y
    );

    context.closePath();
  }

  function loadBuilderImage(url, required = false) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.crossOrigin = "anonymous";

      image.onload = () => resolve(image);

      image.onerror = () => {
        if (required) {
          reject(
            new Error(`Não foi possível carregar a imagem: ${url}`)
          );
          return;
        }

        resolve(null);
      };

      image.src = url;
    });
  }

function drawBuilderCoverImage(
  context,
  image,
  x,
  y,
  width,
  height
) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (imageRatio > boxRatio) {
    sourceWidth = image.height * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / boxRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}

function drawBuilderTeacherImage(
  context,
  image,
  x,
  y,
  width,
  height
) {
  const scale = Math.max(
    width / image.width,
    height / image.height
  );

  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.save();

  context.beginPath();
  context.arc(
    x + width / 2,
    y + height / 2,
    Math.min(width, height) / 2,
    0,
    Math.PI * 2
  );
  context.clip();

  context.drawImage(
    image,
    drawX,
    drawY,
    drawWidth,
    drawHeight
  );

  context.restore();
}


  
  function getBuilderWrappedLines(
    context,
    text,
    maxWidth,
    maxLines
  ) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine
        ? `${currentLine} ${word}`
        : word;

      if (
        context.measureText(testLine).width <= maxWidth
      ) {
        currentLine = testLine;
        return;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length > maxLines) {
      const visibleLines = lines.slice(0, maxLines);
      let lastLine = visibleLines[maxLines - 1];

      while (
        context.measureText(`${lastLine}…`).width > maxWidth &&
        lastLine.length
      ) {
        lastLine = lastLine.slice(0, -1);
      }

      visibleLines[maxLines - 1] = `${lastLine.trim()}…`;

      return visibleLines;
    }

    return lines;
  }

  function drawBuilderTextLines(
    context,
    lines,
    x,
    y,
    lineHeight
  ) {
    lines.forEach((line, index) => {
      context.fillText(
        line,
        x,
        y + index * lineHeight
      );
    });
  }

  function drawBuilderPill(
    context,
    text,
    x,
    y,
    paddingX,
    height,
    background,
    color,
    font
  ) {
    context.font = font;

    const width =
      context.measureText(text).width + paddingX * 2;

    createRoundedPath(
      context,
      x,
      y,
      width,
      height,
      height / 2
    );

    context.fillStyle = background;
    context.fill();

    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(
      text,
      x + width / 2,
      y + height / 2 + 1
    );

    context.textAlign = "left";
    context.textBaseline = "alphabetic";

    return width;
  }

  async function drawBuilderClassCard(
    context,
    lesson,
    horario,
    position
  ) {
    const {
      x,
      y,
      width,
      height
    } = position;

    /* Horário */
    context.font = "800 24px Inter, Arial, sans-serif";

    const timeWidth =
      context.measureText(horario).width + 70;

    const timeX = x + (width - timeWidth) / 2;
    const timeY = y - 68;

    createRoundedPath(
      context,
      timeX,
      timeY,
      timeWidth,
      48,
      24
    );

    context.fillStyle = "#d5007f";
    context.fill();

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      horario,
      timeX + timeWidth / 2,
      timeY + 25
    );

    context.textAlign = "left";
    context.textBaseline = "alphabetic";

    /* Card */
    context.save();
    context.shadowColor = "rgba(8, 7, 10, 0.12)";
    context.shadowBlur = 22;
    context.shadowOffsetY = 8;

    createRoundedPath(
      context,
      x,
      y,
      width,
      height,
      22
    );

    context.fillStyle = "#ffffff";
    context.fill();
    context.restore();

    createRoundedPath(
      context,
      x,
      y,
      width,
      height,
      22
    );

    context.strokeStyle = "#ded9e1";
    context.lineWidth = 2;
    context.stroke();

    const photoX = x + 26;
    const photoY = y + 30;
    const photoSize = 104;

    const teacherImage = await loadBuilderImage(
      lesson.foto,
      false
    );

    context.save();
    context.beginPath();
    context.arc(
      photoX + photoSize / 2,
      photoY + photoSize / 2,
      photoSize / 2,
      0,
      Math.PI * 2
    );

    context.clip();

  if (teacherImage) {
  drawBuilderTeacherImage(
    context,
    teacherImage,
    photoX,
    photoY,
    photoSize,
    photoSize
  );
} else {
      context.fillStyle = "#f2e7ee";
      context.fillRect(
        photoX,
        photoY,
        photoSize,
        photoSize
      );

      context.fillStyle = "#d5007f";
      context.font = "900 34px Inter, Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const initials = String(lesson.professor || "CMB")
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

      context.fillText(
        initials,
        photoX + photoSize / 2,
        photoY + photoSize / 2 + 2
      );
    }

    context.restore();

    context.textAlign = "left";
    context.textBaseline = "alphabetic";

    const contentX = photoX + photoSize + 22;
    const contentWidth =
      x + width - 25 - contentX;

    context.fillStyle = "#08070a";
    context.font = "800 19px Inter, Arial, sans-serif";

    const teacherLines = getBuilderWrappedLines(
      context,
      lesson.professor,
      contentWidth,
      1
    );

    drawBuilderTextLines(
      context,
      teacherLines,
      contentX,
      y + 54,
      23
    );

 context.font = "900 27px Inter, Arial, sans-serif";

const titleLineHeight = 27;

const titleLines = getBuilderWrappedLines(
  context,
  lesson.titulo,
  contentWidth,
  3
);

drawBuilderTextLines(
  context,
  titleLines,
  contentX,
  y + 88,
  titleLineHeight
);

const tagsY =
  y + 88 + titleLines.length * titleLineHeight + 10;

    let tagX = contentX;

    tagX += drawBuilderPill(
      context,
      lesson.categoria || "Categoria",
      tagX,
      tagsY,
      13,
      30,
      "rgba(213, 0, 127, 0.10)",
      "#d5007f",
      "800 14px Inter, Arial, sans-serif"
    ) + 8;

    drawBuilderPill(
      context,
      lesson.nivel || "Todos os níveis",
      tagX,
      tagsY,
      13,
      30,
      "#f2f0f3",
      "#706b75",
      "700 14px Inter, Arial, sans-serif"
    );

    context.strokeStyle = "#ded9e1";
    context.lineWidth = 1;

    context.beginPath();
context.moveTo(x + 24, y + height - 70);
context.lineTo(x + width - 24, y + height - 70);
    context.stroke();

    context.fillStyle = "#706b75";
    context.font = "500 17px Inter, Arial, sans-serif";

    const summaryLines = getBuilderWrappedLines(
      context,
      lesson.resumo || "",
      width - 48,
      3
    );

    drawBuilderTextLines(
      context,
      summaryLines,
x + 24,
y + height - 44,
22
    );
  }

  /* -------------------------------------------------------
     GERA E BAIXA O PNG
     ------------------------------------------------------- */

async function createScheduleImage() {
    nextButton.disabled = true;
    nextButton.textContent = "Gerando imagem...";

    try {
      await document.fonts?.ready;

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;

      const context = canvas.getContext("2d");

      const backgroundUrl =
        cronogramaBackgrounds[builderState.dia];

      const backgroundImage = await loadBuilderImage(
        backgroundUrl,
        true
      );

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

drawBuilderCoverImage(
  context,
  backgroundImage,
  0,
  0,
  canvas.width,
  canvas.height
);



const positions = [
  {
    x: 65,
    y: 330,
    width: 445,
    height: 300
  },
  {
    x: 570,
    y: 340,
    width: 445,
    height: 300
  },
  {
    x: 65,
    y: 770,
    width: 445,
    height: 300
  },
  {
    x: 570,
    y: 770,
    width: 445,
    height: 300
  }
];

      for (
        let index = 0;
        index < builderState.horarios.length;
        index += 1
      ) {
        const horario = builderState.horarios[index];
        const lesson = selectedBuilderClass(horario);

        if (!lesson || !positions[index]) continue;

        await drawBuilderClassCard(
          context,
          lesson,
          horario,
          positions[index]
        );
      }

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((generatedBlob) => {
          if (!generatedBlob) {
            reject(
              new Error("Não foi possível gerar o arquivo PNG.")
            );
            return;
          }

          resolve(generatedBlob);
        }, "image/png");
      });

      if (builderState.imagemUrl) {
        URL.revokeObjectURL(builderState.imagemUrl);
      }

      builderState.imagemBlob = blob;
      builderState.imagemUrl =
        URL.createObjectURL(blob);

   

      previewImage.src = builderState.imagemUrl;

      prepareBuilderSuccessScreen();
      showBuilderView("success");
    } catch (error) {
      console.error(error);

      window.alert(
        "Não foi possível gerar a imagem. Verifique se as fotos e o fundo estão acessíveis."
      );

      renderBuilderStep();
    }
  }

  /* -------------------------------------------------------
     TELA FINAL
     ------------------------------------------------------- */

  function prepareBuilderSuccessScreen() {
    const otherDay =
      builderState.dia === "sabado"
        ? "domingo"
        : "sabado";

    const otherDayLabel =
      otherDay === "sabado"
        ? "sábado"
        : "domingo";

    otherDayButton.dataset.nextDay = otherDay;
    otherDayButton.textContent =
      `Fazer o cronograma de ${otherDayLabel}`;

    const file = builderState.imagemBlob
      ? new File(
          [builderState.imagemBlob],
          `meu-cronograma-cmb-${builderState.dia}.png`,
          { type: "image/png" }
        )
      : null;

    const canShareFile =
      file &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    shareButton.hidden = !canShareFile;
    shareNote.hidden = Boolean(canShareFile);
  }

  async function shareBuilderImage() {
    if (!builderState.imagemBlob) return false;

    const file = new File(
      [builderState.imagemBlob],
      `meu-cronograma-cmb-${builderState.dia}.png`,
      { type: "image/png" }
    );

    if (
      typeof navigator.share !== "function" ||
      typeof navigator.canShare !== "function" ||
      !navigator.canShare({ files: [file] })
    ) {
      return false;
    }

    try {
      await navigator.share({
        title: "Meu cronograma do Comic Market Brasil",
        text: "Confira as aulas que escolhi para o Comic Market Brasil.",
        files: [file]
      });

      return true;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }

      return false;
    }
  }

  function registrarAulasDoCronograma() {
    const aulas = builderState.horarios
      .map((horario) => {
        const aula = selectedBuilderClass(horario);

        if (!aula) return null;

        return {
          nome_aula: aula.titulo,
          nome_professor: aula.professor,
          dia:
            builderState.dia === "sabado"
              ? "Sábado"
              : "Domingo",
          hora: horario
        };
      })
      .filter(Boolean);

    if (!aulas.length) return;

    /*
      A assinatura muda se a pessoa escolher outra aula,
      outro horário ou outro dia.
    */
    if (builderState.contabilizado) {
  return;
}

builderState.contabilizado = true;

    fetch(LEARNING_ANALYTICS_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },
      body: JSON.stringify({
        tipo: "learning_selecoes",
        aulas
      })
    }).catch((erro) => {
      /*
        A experiência da pessoa não é interrompida caso
        a planilha esteja indisponível.
      */
      console.error(
        "Não foi possível registrar as aulas:",
        erro
      );
    });
  }


  
function downloadBuilderImage() {
  if (!builderState.imagemUrl) return;

  const downloadLink = document.createElement("a");

  downloadLink.href = builderState.imagemUrl;
  downloadLink.download =
    `meu-cronograma-cmb-${builderState.dia}.png`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}
  /* -------------------------------------------------------
     EVENTOS
     ------------------------------------------------------- */

  builderOpenButton.addEventListener(
    "click",
    openScheduleBuilder
  );

  builderModal.addEventListener("click", async (event) => {
    const exitButton = event.target.closest(
      "[data-schedule-builder-exit]"
    );

    if (exitButton) {
      closeScheduleBuilder();
      return;
    }

    const dayButton = event.target.closest(
      "[data-builder-day]"
    );

    if (dayButton) {
      startBuilderDay(dayButton.dataset.builderDay);
      return;
    }

    const classButton = event.target.closest(
      "[data-builder-class-index]"
    );

if (classButton) {
  const horario = currentBuilderTime();

  const selectedIndex =
    Number(classButton.dataset.builderClassIndex);

  const mudouAula =
    builderState.selecoes[horario] !== selectedIndex;

  if (mudouAula) {
    builderState.contabilizado = false;
  }

  builderState.selecoes[horario] =
    selectedIndex;

  renderBuilderStep();
  return;
}

    if (event.target.closest("[data-builder-back]")) {
      goToPreviousBuilderStep();
      return;
    }

    if (event.target.closest("[data-builder-next]")) {
      await goToNextBuilderStep();
      return;
    }

if (event.target.closest("[data-builder-download]")) {
  downloadBuilderImage();
  registrarAulasDoCronograma();
  return;
}

if (event.target.closest("[data-builder-share]")) {
  const compartilhou = await shareBuilderImage();

  if (compartilhou) {
    registrarAulasDoCronograma();
  }

  return;
}

    const otherDay = event.target.closest(
      "[data-builder-other-day]"
    );

    if (otherDay) {
      startBuilderDay(otherDay.dataset.nextDay);
      return;
    }

 if (event.target.closest("[data-builder-edit]")) {
  builderState.etapa = builderState.horarios.length - 1;
  showBuilderView("classes");
  renderBuilderStep();
}
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !builderModal.hidden
    ) {
      closeScheduleBuilder();
    }
  });
}



  
learningSection.addEventListener("click", (event) => {
    /* Seleção do horário */
    const timeButton = event.target.closest("[data-learning-time]");

    if (timeButton) {
      activeTime = timeButton.dataset.learningTime;

      learningSection
        .querySelectorAll("[data-learning-time]")
        .forEach((button) => {
          const isActive =
            button.dataset.learningTime === activeTime;

          button.classList.toggle("is-active", isActive);
          button.setAttribute(
            "aria-selected",
            String(isActive)
          );
        });

      renderClasses();
      return;
    }

    /* Abre e fecha os detalhes */
    const detailsButton = event.target.closest(
      ".learning-card-toggle"
    );

    if (detailsButton) {
      const card = detailsButton.closest(".learning-class-card");
      const isOpen =
        detailsButton.getAttribute("aria-expanded") === "true";

      detailsButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      card.classList.toggle("is-open", !isOpen);
    }
  });

  /* =======================================================
     RECALCULA O CARROSSEL AO REDIMENSIONAR
     ======================================================= */

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const classes = learningData[activeDay][activeTime];

    const deveSerCarrossel =
      classes.length > 4 && window.innerWidth > 700;

    const estaEmCarrossel = Boolean(carouselState);

    if (deveSerCarrossel !== estaEmCarrossel) {
      renderClasses();
      return;
    }

    updateCarousel();
  }, 120);
});

  /* Primeira exibição */
  renderClasses();
});
