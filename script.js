/* =========================================================
   CONFIGURAÇÕES RÁPIDAS
   Troque o e-mail abaixo para alterar o destino do formulário.
   O intervalo dos banners está em milissegundos (6500 = 6,5s).
   ========================================================= */
const SITE_CONFIG = {
  emailDestino: "limasketch@gmail.com",
  intervaloBanner: 6500,
};

document.addEventListener("DOMContentLoaded", () => {
  const iniciarSite = () => {
    configurarMenu();
    configurarCabecalho();
    configurarCarrosseis();
     configurarCarrosselVideos();
    configurarSetores();
    configurarFormulario();
    configurarLightbox();
    atualizarAno();
  };

  if (window.componentesProntos) {
    window.componentesProntos
      .then(iniciarSite)
      .catch((erro) => {
        console.error("Erro ao iniciar o site:", erro);
      });
  } else {
    iniciarSite();
  }
});

function configurarMenu() {
  const botao = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  if (!botao || !menu) {
    console.error("Botão ou menu não encontrado.");
    return;
  }

  const fecharMenu = () => {
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  botao.addEventListener("click", () => {
    const estaAberto =
      botao.getAttribute("aria-expanded") === "true";

    botao.setAttribute(
      "aria-expanded",
      String(!estaAberto)
    );

    botao.setAttribute(
      "aria-label",
      estaAberto ? "Abrir menu" : "Fechar menu"
    );

    menu.classList.toggle("is-open", !estaAberto);
    document.body.classList.toggle("menu-open", !estaAberto);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });
}

function configurarCabecalho() {
  const cabecalho = document.querySelector("[data-header]");
  if (!cabecalho || cabecalho.classList.contains("solid-header")) return;

  const atualizar = () => cabecalho.classList.toggle("is-scrolled", window.scrollY > 24);
  atualizar();
  window.addEventListener("scroll", atualizar, { passive: true });
}

function configurarCarrosseis() {
  document.querySelectorAll("[data-carousel]").forEach((elemento) => criarCarrossel(elemento));
}

function configurarSetores() {
  const botoes = [...document.querySelectorAll("[data-sector-toggle]")];

  if (!botoes.length) return;

  botoes.forEach((botao) => {
    const card = botao.closest(".sector-card");

    card?.addEventListener("mouseleave", () => {
      card.classList.remove("is-collapsed");
    });

    botao.addEventListener("click", () => {
      if (!card) return;

      const estavaAberto =
        card.classList.contains("is-expanded");

      botoes.forEach((outroBotao) => {
        const outroCard =
          outroBotao.closest(".sector-card");

        outroCard?.classList.remove(
          "is-expanded",
          "is-collapsed"
        );

        outroBotao.setAttribute(
          "aria-expanded",
          "false"
        );

        outroBotao.firstChild.textContent =
          "Saiba mais ";
      });

      if (!estavaAberto) {
        card.classList.add("is-expanded");

        botao.setAttribute(
          "aria-expanded",
          "true"
        );

        botao.firstChild.textContent =
          "Mostrar menos ";
      } else {
        card.classList.add("is-collapsed");

        botao.setAttribute(
          "aria-expanded",
          "false"
        );

        botao.firstChild.textContent =
          "Saiba mais ";

        botao.blur();
      }
    });
  });
}

function criarCarrossel(carrossel) {
  const trilha = carrossel.querySelector("[data-carousel-track]");
  const slides = [...carrossel.querySelectorAll("[data-carousel-slide]")];
  const botaoAnterior = carrossel.querySelector("[data-carousel-prev]");
  const botaoProximo = carrossel.querySelector("[data-carousel-next]");
  const areaPontos = carrossel.querySelector("[data-carousel-dots]");
  const botaoPausa = carrossel.querySelector("[data-carousel-pause]");
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!trilha || slides.length < 2) return;

  let indice = 0;
  let maximo = slides.length - 1;
  let temporizador = null;
  let pausadoPeloUsuario = false;
  let ponteiroInicial = null;
  let deslocamento = 0;
  let bloquearClique = false;

  const porTela = () => {
    const configurado = Number(carrossel.dataset.perView || 1);
    if (configurado === 1) return 1;
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 900) return Math.min(2, configurado);
    return configurado;
  };

  const intervalo = () => {
    const valorHtml = Number(carrossel.dataset.autoplay || 0);
    return carrossel.classList.contains("hero-carousel") ? SITE_CONFIG.intervaloBanner : valorHtml;
  };

  const criarPontos = () => {
    if (!areaPontos) return;
    areaPontos.replaceChildren();
    for (let i = 0; i <= maximo; i += 1) {
      const ponto = document.createElement("button");
      ponto.type = "button";
      ponto.className = "carousel-dot";
      ponto.setAttribute("role", "tab");
      ponto.setAttribute("aria-label", `Ir para o item ${i + 1}`);
      ponto.addEventListener("click", () => irPara(i, true));
      areaPontos.appendChild(ponto);
    }
  };

  const atualizarAcessibilidade = () => {
    const visiveis = porTela();
    slides.forEach((slide, i) => {
      const visivel = i >= indice && i < indice + visiveis;
      slide.classList.toggle("is-active", visivel);
      slide.setAttribute("aria-hidden", String(!visivel));
      slide.inert = !visivel;
    });
    if (areaPontos) {
      [...areaPontos.children].forEach((ponto, i) => {
        const ativo = i === indice;
        ponto.classList.toggle("is-active", ativo);
        ponto.setAttribute("aria-selected", String(ativo));
        ponto.setAttribute("tabindex", ativo ? "0" : "-1");
      });
    }
  };

  const aplicarPosicao = (animar = true) => {
    carrossel.classList.toggle("is-dragging", !animar);
    const alvo = slides[indice];
    const posicao = alvo ? alvo.offsetLeft : 0;
    trilha.style.transform = `translate3d(${-posicao}px, 0, 0)`;
    atualizarAcessibilidade();
  };

  const pararAutomatico = () => {
    window.clearInterval(temporizador);
    temporizador = null;
  };

  const iniciarAutomatico = () => {
    pararAutomatico();
    if (intervalo() <= 0 || pausadoPeloUsuario || reduzMovimento.matches || document.hidden) return;
    temporizador = window.setInterval(() => irPara(indice + 1, false), intervalo());
  };

  const irPara = (novoIndice, interacao = false) => {
    indice = novoIndice > maximo ? 0 : novoIndice < 0 ? maximo : novoIndice;
    aplicarPosicao(true);
    if (interacao) iniciarAutomatico();
  };

  const recalcular = () => {
    maximo = Math.max(0, slides.length - porTela());
    indice = Math.min(indice, maximo);
    criarPontos();
    aplicarPosicao(false);
    window.requestAnimationFrame(() => carrossel.classList.remove("is-dragging"));
  };

  botaoAnterior?.addEventListener("click", () => irPara(indice - 1, true));
  botaoProximo?.addEventListener("click", () => irPara(indice + 1, true));

  botaoPausa?.addEventListener("click", () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    botaoPausa.textContent = pausadoPeloUsuario ? "▶" : "Ⅱ";
    botaoPausa.setAttribute("aria-label", pausadoPeloUsuario ? "Retomar rotação automática" : "Pausar rotação automática");
    iniciarAutomatico();
  });

  carrossel.addEventListener("mouseenter", pararAutomatico);
  carrossel.addEventListener("mouseleave", iniciarAutomatico);
  carrossel.addEventListener("focusin", pararAutomatico);
  carrossel.addEventListener("focusout", (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) iniciarAutomatico();
  });
  carrossel.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      irPara(indice - 1, true);
    }
    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      irPara(indice + 1, true);
    }
  });

  trilha.addEventListener("pointerdown", (evento) => {
    if (evento.pointerType === "mouse" && evento.button !== 0) return;
    ponteiroInicial = evento.clientX;
    deslocamento = 0;
    trilha.setPointerCapture?.(evento.pointerId);
    carrossel.classList.add("is-dragging");
    pararAutomatico();
  });

  trilha.addEventListener("pointermove", (evento) => {
    if (ponteiroInicial === null) return;
    deslocamento = evento.clientX - ponteiroInicial;
    if (Math.abs(deslocamento) > 8) bloquearClique = true;
    const base = slides[indice]?.offsetLeft || 0;
    trilha.style.transform = `translate3d(${deslocamento - base}px, 0, 0)`;
  });

  const terminarArraste = () => {
    if (ponteiroInicial === null) return;
    carrossel.classList.remove("is-dragging");
    if (Math.abs(deslocamento) > 45) irPara(indice + (deslocamento < 0 ? 1 : -1), true);
    else aplicarPosicao(true);
    ponteiroInicial = null;
    deslocamento = 0;
    iniciarAutomatico();
    if (bloquearClique) window.setTimeout(() => { bloquearClique = false; }, 0);
  };

  trilha.addEventListener("pointerup", terminarArraste);
  trilha.addEventListener("pointercancel", terminarArraste);
  trilha.addEventListener("dragstart", (evento) => evento.preventDefault());
  trilha.addEventListener(
    "click",
    (evento) => {
      if (!bloquearClique) return;
      evento.preventDefault();
      evento.stopPropagation();
      bloquearClique = false;
    },
    true,
  );

  let ajusteResize = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(ajusteResize);
    ajusteResize = window.setTimeout(recalcular, 120);
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? pararAutomatico() : iniciarAutomatico()));
  reduzMovimento.addEventListener?.("change", iniciarAutomatico);

  recalcular();
  iniciarAutomatico();
}

function configurarFormulario() {
  const formulario = document.querySelector("[data-contact-form]");
  if (!formulario) return;

  formulario.action = `https://formsubmit.co/${SITE_CONFIG.emailDestino}`;

  const proximaPagina = formulario.querySelector("[data-form-next]");
  if (proximaPagina && window.location.protocol !== "file:") {
    proximaPagina.value = `${window.location.origin}${window.location.pathname}?enviado=1`;
  }

  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get("enviado") === "1") {
    const aviso = formulario.querySelector("[data-form-success]");
    if (aviso) {
      aviso.hidden = false;
      window.setTimeout(() => aviso.focus(), 100);
    }
    window.history.replaceState({}, "", window.location.pathname);
  }

  formulario.addEventListener("submit", () => {
    const botao = formulario.querySelector("button[type='submit']");
    if (!botao) return;
    botao.disabled = true;
    botao.textContent = "Enviando...";
  });
}

function atualizarAno() {
  document.querySelectorAll("[data-current-year]").forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });
}

/* IMAGEM AMPLIADA */


function configurarLightbox() {
  const modal = document.querySelector("[data-image-modal]");
  const imagemModal = document.querySelector("[data-image-modal-content]");
  const botaoFechar = document.querySelector("[data-image-modal-close]");

  if (!modal || !imagemModal) return;

  let ultimoElementoClicado = null;
  let elementoPressionado = null;
  let inicioX = 0;
  let inicioY = 0;

  function abrirModal(elemento) {
    const imagemDentro = elemento.querySelector("img");

    const enderecoImagem =
      elemento.getAttribute("data-image") ||
      imagemDentro?.currentSrc ||
      imagemDentro?.src;

    if (!enderecoImagem) return;

    ultimoElementoClicado = elemento;

    imagemModal.src = enderecoImagem;
    imagemModal.alt =
      imagemDentro?.alt || "Imagem ampliada";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    botaoFechar?.focus();
  }

  function fecharModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    imagemModal.removeAttribute("src");
    ultimoElementoClicado?.focus();
  }

  document.addEventListener(
    "pointerdown",
    (evento) => {
      elementoPressionado =
        evento.target instanceof Element
          ? evento.target.closest("[data-lightbox]")
          : null;

      if (!elementoPressionado) return;

      inicioX = evento.clientX;
      inicioY = evento.clientY;
    },
    true
  );

  document.addEventListener(
    "click",
    (evento) => {
      const elementoDoClique =
        evento.target instanceof Element
          ? evento.target.closest("[data-lightbox]")
          : null;

      /*
       * Quando o carrossel captura o ponteiro, usamos
       * a imagem guardada durante o pointerdown.
       */
      const elemento =
        elementoDoClique || elementoPressionado;

      if (!elemento) return;

      const movimentoX = Math.abs(evento.clientX - inicioX);
      const movimentoY = Math.abs(evento.clientY - inicioY);

      elementoPressionado = null;

      /*
       * Se houve movimento, foi um arraste.
       */
      if (movimentoX > 15 || movimentoY > 15) return;

      evento.preventDefault();
      abrirModal(elemento);
    },
    true
  );

  botaoFechar?.addEventListener("click", fecharModal);

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      fecharModal();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      modal.classList.contains("is-open")
    ) {
      fecharModal();
    }
  });
}
function configurarCarrosselVideos() {
  const carrossel = document.querySelector("[data-videos-carousel]");

  if (!carrossel) return;

  const track = carrossel.querySelector("[data-videos-track]");
  const cards = Array.from(
    carrossel.querySelectorAll(".videos-cmb-card")
  );

  const anterior = carrossel.querySelector("[data-videos-prev]");
  const proximo = carrossel.querySelector("[data-videos-next]");
  const atual = carrossel.querySelector("[data-videos-current]");
  const total = carrossel.querySelector("[data-videos-total]");

  if (!track || !cards.length || !anterior || !proximo) return;

  let indice = 0;

  function quantidadeVisivel() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  }

  function atualizarCarrossel() {
    const visiveis = quantidadeVisivel();
    const indiceMaximo = Math.max(0, cards.length - visiveis);

    indice = Math.min(indice, indiceMaximo);

    const primeiroCard = cards[0];
    const estilosTrack = window.getComputedStyle(track);
    const espaco = parseFloat(estilosTrack.columnGap) || 0;
    const deslocamento =
      indice * (primeiroCard.getBoundingClientRect().width + espaco);

    track.style.transform = `translateX(-${deslocamento}px)`;

    anterior.disabled = indice === 0;
    proximo.disabled = indice === indiceMaximo;

    if (atual) atual.textContent = String(indice + 1);
    if (total) total.textContent = String(indiceMaximo + 1);
  }

  anterior.addEventListener("click", () => {
    indice -= 1;
    atualizarCarrossel();
  });

  proximo.addEventListener("click", () => {
    indice += 1;
    atualizarCarrossel();
  });

  let temporizadorResize;

  window.addEventListener("resize", () => {
    clearTimeout(temporizadorResize);

    temporizadorResize = setTimeout(() => {
      atualizarCarrossel();
    }, 120);
  });

  atualizarCarrossel();
}
